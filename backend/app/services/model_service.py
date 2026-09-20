import os
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List, Tuple
from sklearn.preprocessing import LabelEncoder

from ..core.config import PHASE3_DIR, settings
from ..schemas.prediction import (
    EnvironmentalData,
    SatelliteSpectralData,
    CropRecommendation,
    ModelBranchBreakdown,
    ModelMetricsResponse
)
from .agronomy_service import CROP_PROFILES

class HybridPredictorEngine:
    """
    Production Hybrid Multi-Modal Inference Engine for TerraVision Dakshina Kannada.
    Loads and executes:
      - Phase 1: Tabular XGBoost model
      - Phase 2: Satellite Spectral RandomForest model
      - Phase 3: Authentic Meta-Fusion ExtraTrees model
    """

    def __init__(self):
        self.models_dir = PHASE3_DIR / "models"
        self.plots_dir = PHASE3_DIR / "plots"
        self.metrics_dir = PHASE3_DIR / "metrics"

        print(f"Loading TerraVision models from {self.models_dir}...")
        
        # Load models
        self.phase1_model = joblib.load(self.models_dir / "phase1_tabular_model.pkl")
        self.phase2_model = joblib.load(self.models_dir / "phase2_satellite_model.pkl")
        self.phase3_model = joblib.load(self.models_dir / "phase3_best_fusion_model.pkl")
        self.metadata = joblib.load(self.models_dir / "phase3_metadata.pkl")

        self.label_encoder = self.metadata["label_encoder"]
        self.classes = list(self.metadata["classes"])

        # Encoders for categorical inputs
        self.location_encoder = LabelEncoder()
        self.season_encoder = LabelEncoder()
        self.soil_encoder = LabelEncoder()
        self.irrigation_encoder = LabelEncoder()

        # The Phase 1 XGBoost model was trained on 5 agro-climatic regional archetypes:
        # ['Bangalore', 'Kodagu', 'Mangalore', 'Mysore', 'Raichur']
        self.location_encoder.fit(['Bangalore', 'Kodagu', 'Mangalore', 'Mysore', 'Raichur'])
        self.season_encoder.fit(["Kharif", "Rabi", "Zaid"])
        self.soil_encoder.fit(["Alluvial", "Red", "Black", "Laterite"])
        self.irrigation_encoder.fit(["Drip", "Sprinkler", "Canal", "Rain-fed"])

        # Map Dakshina Kannada taluks and zones to the corresponding training archetype
        self.taluk_to_archetype = {
            "Mangaluru": "Mangalore",      # Coastal maritime (Coconut, Arecanut, Cashew)
            "Bantwal": "Mangalore",        # Midland river valley (Arecanut, Cocoa, Pepper)
            "Puttur": "Mangalore",         # Prime plantation belt (Arecanut, Cocoa, Pepper)
            "Sullia": "Kodagu",            # Western Ghats highland border (Coffee, Cardamum, Pepper)
            "Kadaba": "Kodagu",            # Foothill spice valley (Cardamum, Rubber, Pepper)
            "Belthangady": "Bangalore",    # Riverine plains & paddy foothills (Ginger, Paddy, Blackgram)
            "Moodbidri": "Bangalore"       # Laterite northern plateaus (Cashew, Groundnut, Paddy)
        }

        print(f"TerraVision Predictor Initialized with {len(self.classes)} crops.")

    def _encode_val(self, val: str, encoder: LabelEncoder, default_idx: int = 0) -> int:
        try:
            return int(encoder.transform([val])[0])
        except Exception:
            return default_idx

    def _build_phase1_features(
        self,
        taluk: str,
        env: EnvironmentalData,
        area_acres: float
    ) -> np.ndarray:
        """
        Build Phase 1 tabular feature vector (matching inference_pipeline.py).
        """
        # Map DK taluk to the calibrated climatic archetype
        archetype = self.taluk_to_archetype.get(taluk, "Mangalore")
        loc_code = self._encode_val(archetype, self.location_encoder)
        season_code = self._encode_val(env.season, self.season_encoder)
        soil_code = self._encode_val(env.soil_type, self.soil_encoder)
        irrig_code = self._encode_val(env.irrigation, self.irrigation_encoder)

        year = 2026
        rainfall = env.rainfall_mm
        temperature = env.temperature_c
        humidity = env.humidity_pct
        area_ha = area_acres * 0.404686
        yield_proxy = 2200.0 + (rainfall / 5.0)

        features = [
            loc_code,
            season_code,
            year,
            rainfall,
            temperature,
            humidity,
            area_ha * 100.0,
            yield_proxy,
            soil_code,
            irrig_code,
            # Interactions
            rainfall * temperature,
            rainfall / ((area_ha * 100.0) + 1.0),
            yield_proxy / ((area_ha * 100.0) + 1.0)
        ]
        return np.array([features])

    def _build_phase2_features(self, sat: SatelliteSpectralData) -> np.ndarray:
        """
        Build Phase 2 satellite spectral vector:
        [NDVI, EVI, SAVI, LAI, NDWI, Soil Moisture, LST]
        """
        features = [
            sat.ndvi,
            sat.evi,
            sat.savi,
            sat.lai,
            sat.ndwi,
            sat.soil_moisture_index,
            sat.lst_c
        ]
        return np.array([features])

    def predict(
        self,
        taluk: str,
        env: EnvironmentalData,
        sat: SatelliteSpectralData,
        area_acres: float = 2.5,
        top_k: int = 3
    ) -> Tuple[List[CropRecommendation], ModelBranchBreakdown, Dict[str, Any]]:
        """
        Run the complete multi-modal pipeline and generate crop yield forecasts.
        """
        X_p1 = self._build_phase1_features(taluk, env, area_acres)
        X_p2 = self._build_phase2_features(sat)

        # 1. Phase 1 Tabular Model Inference
        p1_probs = self.phase1_model.predict_proba(X_p1)

        # 2. Phase 2 Satellite Model Inference
        p2_probs = self.phase2_model.predict_proba(X_p2)

        # 3. Phase 3 Fusion Model Inference
        context = np.array([[env.rainfall_mm, env.temperature_c, env.humidity_pct]])
        X_fusion = np.hstack([p1_probs, p2_probs, context])
        fusion_probs = self.phase3_model.predict_proba(X_fusion)[0]

        # Order predictions
        ranked_indices = np.argsort(fusion_probs)[::-1]

        recommendations: List[CropRecommendation] = []
        for rank, idx in enumerate(ranked_indices[:top_k], start=1):
            crop_name = self.classes[idx]
            conf = float(fusion_probs[idx])
            profile = CROP_PROFILES.get(crop_name, CROP_PROFILES["Arecanut"])

            # Local micro-climate yield modifier
            # Higher rainfall & fertile laterite yields optimum for plantations
            rain_factor = min(1.2, max(0.85, env.rainfall_mm / 3800.0))
            ndvi_factor = min(1.25, max(0.80, sat.ndvi / 0.65))
            climate_modifier = (rain_factor * 0.5) + (ndvi_factor * 0.5)

            yield_t_per_ha = round(profile["yield_t_per_ha"] * climate_modifier, 2)
            yield_q_per_acre = round(yield_t_per_ha * 4.047, 2)
            total_q = round(yield_q_per_acre * area_acres, 2)
            total_t = round(total_q / 10.0, 2)
            price_q = float(profile["price_per_quintal_inr"])
            revenue = round(total_q * price_q, 2)

            risk = "Low" if conf >= 0.40 else ("Moderate" if conf >= 0.20 else "Elevated")

            recommendations.append(
                CropRecommendation(
                    rank=rank,
                    crop=crop_name,
                    confidence=round(conf, 4),
                    confidence_pct=f"{conf * 100:.1f}%",
                    suitability_score=round(conf * 100, 1),
                    yield_t_per_ha=yield_t_per_ha,
                    yield_quintals_per_acre=yield_q_per_acre,
                    total_yield_tonnes=total_t,
                    total_yield_quintals=total_q,
                    estimated_revenue_inr=revenue,
                    market_price_per_quintal_inr=price_q,
                    growth_duration_days=profile["duration_days"],
                    harvest_season=profile["harvest_season"],
                    risk_level=risk
                )
            )

        # Modality comparison breakdown
        p1_top_idx = np.argsort(p1_probs[0])[::-1][:3]
        p2_top_idx = np.argsort(p2_probs[0])[::-1][:3]

        p1_top = [
            {"crop": self.classes[i], "confidence": round(float(p1_probs[0][i]), 4), "pct": f"{float(p1_probs[0][i])*100:.1f}%"}
            for i in p1_top_idx
        ]
        p2_top = [
            {"crop": self.classes[i], "confidence": round(float(p2_probs[0][i]), 4), "pct": f"{float(p2_probs[0][i])*100:.1f}%"}
            for i in p2_top_idx
        ]
        p3_top = [
            {"crop": rec.crop, "confidence": rec.confidence, "pct": rec.confidence_pct}
            for rec in recommendations
        ]

        breakdown = ModelBranchBreakdown(
            phase1_tabular_top=p1_top,
            phase2_satellite_top=p2_top,
            phase3_fusion_top=p3_top,
            fusion_gain_description=(
                "Meta-Fusion synergizes environmental tabular vectors with satellite radiometric indices, "
                "reducing coastal false-positives and achieving 88.29% validated test accuracy."
            )
        )

        top_crop = recommendations[0]
        yield_summary = {
            "primary_crop": top_crop.crop,
            "forecasted_yield_per_acre": f"{top_crop.yield_quintals_per_acre} Quintals",
            "forecasted_yield_per_ha": f"{top_crop.yield_t_per_ha} Tonnes",
            "farm_total_yield": f"{top_crop.total_yield_quintals} Quintals ({top_crop.total_yield_tonnes} Tonnes)",
            "gross_revenue_estimate_inr": f"₹{top_crop.estimated_revenue_inr:,.2f}",
            "farm_size_acres": area_acres,
            "optimal_harvest_season": top_crop.harvest_season
        }

        return recommendations, breakdown, yield_summary

    def get_metrics_summary(self) -> ModelMetricsResponse:
        """Return benchmark metrics from the authentic training run."""
        comparison_file = self.metrics_dir / "phase3_model_comparison.csv"
        rankings = []
        if comparison_file.exists():
            df = pd.read_csv(comparison_file)
            rankings = df.to_dict(orient="records")

        three_phase = [
            {"phase": "Phase 1: Tabular XGBoost", "train_acc": "100.0%", "test_acc": "89.08%", "features": "13 Environmental Variables"},
            {"phase": "Phase 2: Satellite RandomForest", "train_acc": "54.63%", "test_acc": "45.89%", "features": "7 Spectral Band Indices"},
            {"phase": "Phase 3: Meta-Fusion ExtraTrees", "train_acc": "100.0%", "test_acc": "88.29%", "features": "29 Multi-Modal Fused Dims"}
        ]

        # Check plot files
        available_plots = []
        if self.plots_dir.exists():
            for p in self.plots_dir.glob("*.png"):
                available_plots.append(p.name)

        return ModelMetricsResponse(
            best_model_name=self.metadata.get("best_model_name", "ExtraTrees"),
            test_accuracy=round(float(self.metadata.get("best_test_accuracy", 0.8829)), 4),
            train_accuracy=1.0,
            f1_weighted=0.8792,
            f1_macro=0.7859,
            precision=0.8835,
            recall=0.8829,
            supported_crops=self.classes,
            three_phase_comparison=three_phase,
            model_rankings=rankings,
            available_plots=sorted(available_plots)
        )

# Global singleton
predictor_engine = HybridPredictorEngine()

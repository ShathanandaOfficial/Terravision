from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class LocationInput(BaseModel):
    lat: float = Field(..., description="Latitude coordinate")
    lon: float = Field(..., description="Longitude coordinate")
    place_name: Optional[str] = Field(None, description="Descriptive place name or village")
    taluk: Optional[str] = Field(None, description="Taluk name within Dakshina Kannada")
    season: Optional[str] = Field("Kharif", description="Crop season: Kharif, Rabi, Zaid")
    area_acres: Optional[float] = Field(2.5, description="Farm land size in acres")
    soil_type: Optional[str] = Field(None, description="Optional soil type override")
    irrigation: Optional[str] = Field("Rain-fed", description="Irrigation method: Rain-fed, Drip, Sprinkler, Canal")

class GeofenceCheck(BaseModel):
    is_inside_dk: bool
    district: str
    taluk: Optional[str]
    nearest_taluk: str
    distance_km: float
    message: str

class EnvironmentalData(BaseModel):
    rainfall_mm: float
    temperature_c: float
    humidity_pct: float
    elevation_m: float
    soil_type: str
    irrigation: str
    season: str
    agro_climatic_zone: str

class SatelliteSpectralData(BaseModel):
    ndvi: float = Field(..., description="Normalized Difference Vegetation Index (0.0 to 1.0)")
    evi: float = Field(..., description="Enhanced Vegetation Index")
    ndwi: float = Field(..., description="Normalized Difference Water Index")
    savi: float = Field(..., description="Soil-Adjusted Vegetation Index")
    lai: float = Field(..., description="Leaf Area Index (0.0 to 6.0)")
    lst_c: float = Field(..., description="Land Surface Temperature in Celsius")
    soil_moisture_index: float = Field(..., description="Surface soil moisture proxy (10 to 45)")
    satellite_source: str = "Sentinel-2 / GEE Radiometric Index Simulation"
    vegetation_health_label: str

class CropRecommendation(BaseModel):
    rank: int
    crop: str
    confidence: float
    confidence_pct: str
    suitability_score: float
    yield_t_per_ha: float
    yield_quintals_per_acre: float
    total_yield_tonnes: float
    total_yield_quintals: float
    estimated_revenue_inr: float
    market_price_per_quintal_inr: float
    growth_duration_days: int
    harvest_season: str
    risk_level: str

class ModelBranchBreakdown(BaseModel):
    phase1_tabular_top: List[Dict[str, Any]]
    phase2_satellite_top: List[Dict[str, Any]]
    phase3_fusion_top: List[Dict[str, Any]]
    fusion_gain_description: str

class AgronomicAdvice(BaseModel):
    primary_crop: str
    recommended_fertilizer: str
    npk_ratio: str
    irrigation_schedule: str
    soil_management: str
    pest_management: str
    economic_outlook: str

class PredictionResponse(BaseModel):
    success: bool
    location_summary: Dict[str, Any]
    environmental: EnvironmentalData
    satellite: SatelliteSpectralData
    recommended_crop: str
    yield_forecast: Dict[str, Any]
    top_recommendations: List[CropRecommendation]
    model_breakdown: ModelBranchBreakdown
    agronomic_advice: AgronomicAdvice
    timestamp: str

class SearchResultItem(BaseModel):
    display_name: str
    name: str
    lat: float
    lon: float
    taluk: Optional[str]
    type: str
    is_inside_dk: bool

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem]

class ModelMetricsResponse(BaseModel):
    best_model_name: str
    test_accuracy: float
    train_accuracy: float
    f1_weighted: float
    f1_macro: float
    precision: float
    recall: float
    supported_crops: List[str]
    three_phase_comparison: List[Dict[str, Any]]
    model_rankings: List[Dict[str, Any]]
    available_plots: List[str]

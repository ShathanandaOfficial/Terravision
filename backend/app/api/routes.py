import os
import requests
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from typing import List, Optional

from ..core.config import settings, PHASE3_DIR
from ..schemas.prediction import (
    LocationInput,
    PredictionResponse,
    GeofenceCheck,
    SearchResponse,
    SearchResultItem,
    ModelMetricsResponse
)
from ..services.geofence_service import check_dakshina_kannada_geofence
from ..services.climate_satellite_service import fetch_live_climate_and_satellite
from ..services.model_service import predictor_engine
from ..services.agronomy_service import generate_agronomy_advice
from ..services.geocoding_service import resolve_universal_dk_places

router = APIRouter()

@router.get("/geofence-check", response_model=GeofenceCheck)
async def check_geofence(lat: float = Query(...), lon: float = Query(...)):
    """Check whether a coordinate point is within Dakshina Kannada district."""
    return check_dakshina_kannada_geofence(lat, lon)

@router.post("/predict", response_model=PredictionResponse)
async def predict_crop_and_yield(loc: LocationInput):
    """
    Run the Hybrid Multi-Modal Crop Forecasting Model for a location in Dakshina Kannada.
    Strictly enforces Dakshina Kannada geofencing.
    """
    geofence = check_dakshina_kannada_geofence(loc.lat, loc.lon)
    if not geofence.is_inside_dk:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "OUTSIDE_DAKSHINA_KANNADA",
                "message": geofence.message,
                "nearest_taluk": geofence.nearest_taluk,
                "distance_km": geofence.distance_km,
                "lat": loc.lat,
                "lon": loc.lon
            }
        )

    assigned_taluk = loc.taluk or geofence.taluk or geofence.nearest_taluk

    # 1. Real-time Climate and Satellite spectral data
    env_data, sat_data = fetch_live_climate_and_satellite(
        lat=loc.lat,
        lon=loc.lon,
        nearest_taluk=assigned_taluk,
        season=loc.season or "Kharif",
        user_soil=loc.soil_type,
        user_irrigation=loc.irrigation
    )

    # 2. Hybrid ML Prediction & Yield Forecasting
    recommendations, breakdown, yield_summary = predictor_engine.predict(
        taluk=assigned_taluk,
        env=env_data,
        sat=sat_data,
        area_acres=loc.area_acres or 2.5,
        top_k=4
    )

    primary_rec = recommendations[0]

    # 3. Agronomic Advisory
    agronomy = generate_agronomy_advice(
        crop=primary_rec.crop,
        soil_type=env_data.soil_type,
        rainfall_mm=env_data.rainfall_mm
    )

    location_summary = {
        "latitude": loc.lat,
        "longitude": loc.lon,
        "place_name": loc.place_name or f"{assigned_taluk} Farm Sector",
        "taluk": assigned_taluk,
        "district": settings.DISTRICT_NAME,
        "state": settings.STATE,
        "area_acres": loc.area_acres or 2.5
    }

    return PredictionResponse(
        success=True,
        location_summary=location_summary,
        environmental=env_data,
        satellite=sat_data,
        recommended_crop=primary_rec.crop,
        yield_forecast=yield_summary,
        top_recommendations=recommendations,
        model_breakdown=breakdown,
        agronomic_advice=agronomy,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

@router.get("/search", response_model=SearchResponse)
async def search_places(q: str = Query(..., min_length=2)):
    """
    Search places, villages, neighborhoods, and plot sectors across Dakshina Kannada.
    Combines live Nominatim bounded geocoding, Google Suggest platform recommendations,
    and high-precision in-memory gazetteer covering all 7 taluks.
    """
    results = resolve_universal_dk_places(q)
    return SearchResponse(query=q, results=results)

@router.get("/reverse-geocode")
async def reverse_geocode(lat: float = Query(...), lon: float = Query(...)):
    """Reverse geocode coordinate point dynamically via free Nominatim."""
    geo_check = check_dakshina_kannada_geofence(lat, lon)
    place_name = f"{geo_check.nearest_taluk} Sector"
    
    if geo_check.is_inside_dk:
        try:
            url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
            headers = {"User-Agent": "TerraVision-DakshinaKannada-CropForecaster/2.0"}
            resp = requests.get(url, headers=headers, timeout=3.0)
            if resp.status_code == 200:
                data = resp.json()
                addr = data.get("address", {})
                village = addr.get("village") or addr.get("suburb") or addr.get("town") or addr.get("city")
                if village:
                    place_name = f"{village}, {geo_check.nearest_taluk}"
                else:
                    place_name = data.get("display_name", place_name).split(",")[0]
        except Exception:
            pass

    return {
        "lat": lat,
        "lon": lon,
        "place_name": place_name,
        "is_inside_dk": geo_check.is_inside_dk,
        "district": geo_check.district,
        "taluk": geo_check.taluk or geo_check.nearest_taluk,
        "message": geo_check.message
    }

@router.get("/metrics", response_model=ModelMetricsResponse)
async def get_metrics():
    """Retrieve model comparison metrics and plot registry from authentic training."""
    return predictor_engine.get_metrics_summary()

@router.get("/plots/{plot_name}")
async def get_plot_image(plot_name: str):
    """Serve authentic training plot images."""
    file_path = PHASE3_DIR / "plots" / plot_name
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Plot image not found")
    return FileResponse(path=file_path, media_type="image/png")

@router.get("/taluks")
async def get_taluks():
    """List all 7 Taluks of Dakshina Kannada with coordinates and agro-climatic zones."""
    return {
        "district": settings.DISTRICT_NAME,
        "kannada": settings.DISTRICT_KANNADA,
        "taluks": settings.TALUK_CENTERS
    }

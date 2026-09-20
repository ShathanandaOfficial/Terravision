from pathlib import Path
from typing import List, Tuple
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent
WORKSPACE_DIR = BASE_DIR.parent
MODEL_ZIP_DIR = WORKSPACE_DIR / "Model Zip"
PHASE3_DIR = MODEL_ZIP_DIR / "phase3_artifacts_v2.0" / "phase3_artifacts_v2.0"
PHASE2_DIR = MODEL_ZIP_DIR / "phase2_fusion_artifacts" / "phase2_fusion_artifacts"
PHASE1_DIR = MODEL_ZIP_DIR / "Phase1_numericle_artifacts" / "artifacts_v12"

class Settings(BaseModel):
    APP_NAME: str = "TerraVision - Hybrid Crop Yield Forecasting"
    APP_VERSION: str = "2.0.0"
    DISTRICT_NAME: str = "Dakshina Kannada"
    DISTRICT_KANNADA: str = "ದಕ್ಷಿಣ ಕನ್ನಡ"
    STATE: str = "Karnataka"
    
    # Dakshina Kannada Bounding Box for fast initial culling
    # Lat: 12.45° N to 13.25° N
    # Lon: 74.75° E to 75.68° E
    DK_LAT_MIN: float = 12.45
    DK_LAT_MAX: float = 13.25
    DK_LON_MIN: float = 74.75
    DK_LON_MAX: float = 75.68
    
    # 7 Official Taluks of Dakshina Kannada
    TALUKS: List[str] = [
        "Mangaluru",
        "Bantwal",
        "Belthangady",
        "Puttur",
        "Sullia",
        "Moodbidri",
        "Kadaba"
    ]
    
    # Representative coordinates for the 7 taluk centers
    TALUK_CENTERS: dict = {
        "Mangaluru": {"lat": 12.9141, "lon": 74.8560, "elevation": 22, "zone": "Coastal Lowland"},
        "Bantwal": {"lat": 12.8903, "lon": 75.0347, "elevation": 36, "zone": "Midland River Valley"},
        "Belthangady": {"lat": 12.9983, "lon": 75.2588, "elevation": 86, "zone": "Western Ghats Foothill"},
        "Puttur": {"lat": 12.7663, "lon": 75.2033, "elevation": 90, "zone": "Midland Plantation Belt"},
        "Sullia": {"lat": 12.5606, "lon": 75.3892, "elevation": 115, "zone": "Highland Ghats Border"},
        "Moodbidri": {"lat": 13.0694, "lon": 74.9961, "elevation": 54, "zone": "Northern Midland Plateaus"},
        "Kadaba": {"lat": 12.7381, "lon": 75.4522, "elevation": 102, "zone": "Kumaradhara River Basin"}
    }
    
    # Detailed polygon points approximating Dakshina Kannada district perimeter
    DK_POLYGON: List[Tuple[float, float]] = [
        # (lat, lon) clockwise perimeter
        (13.15, 74.80), # Mulki coastal north
        (13.22, 75.02), # Moodbidri north border
        (13.20, 75.25), # Belthangady north ghats
        (13.08, 75.40), # Charmadi ghat ridge
        (12.90, 75.58), # Shiradi ghat ridge
        (12.70, 75.62), # Bisle ghat border
        (12.50, 75.48), # Subramanya / Sullia south-east border
        (12.48, 75.30), # Sullia / Kasaragod border
        (12.65, 75.05), # Vitla / Kasaragod border
        (12.75, 74.90), # Ullal / Someshwara south coast
        (12.91, 74.80), # Mangalore port / Bengre coast
        (13.05, 74.78), # Surathkal coast
        (13.15, 74.80)  # Close polygon
    ]

settings = Settings()

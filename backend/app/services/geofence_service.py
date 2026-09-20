import math
from typing import Tuple, Optional
from ..core.config import settings
from ..schemas.prediction import GeofenceCheck

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in km."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def point_in_polygon(lat: float, lon: float, polygon: list) -> bool:
    """Ray casting algorithm to determine if (lat, lon) is inside polygon."""
    n = len(polygon)
    inside = False
    p1x, p1y = polygon[0][1], polygon[0][0]  # lon, lat
    for i in range(n + 1):
        p2x, p2y = polygon[i % n][1], polygon[i % n][0]
        if lat > min(p1y, p2y):
            if lat <= max(p1y, p2y):
                if lon <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (lat - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or lon <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside

def check_dakshina_kannada_geofence(lat: float, lon: float) -> GeofenceCheck:
    """
    Validate whether a point is within Dakshina Kannada district.
    """
    # 1. First find nearest taluk and distance
    nearest_taluk = "Mangaluru"
    min_dist = float("inf")
    for taluk, data in settings.TALUK_CENTERS.items():
        dist = haversine_distance(lat, lon, data["lat"], data["lon"])
        if dist < min_dist:
            min_dist = dist
            nearest_taluk = taluk

    # 2. Check bounding box (with slight buffer for coastal and border farms)
    buffer = 0.02
    in_bbox = (
        (settings.DK_LAT_MIN - buffer) <= lat <= (settings.DK_LAT_MAX + buffer) and
        (settings.DK_LON_MIN - buffer) <= lon <= (settings.DK_LON_MAX + buffer)
    )

    # 3. Check detailed polygon
    in_poly = point_in_polygon(lat, lon, settings.DK_POLYGON)

    # If within reasonable distance to a taluk center (within 35km from taluk center and in bounding box)
    is_inside = (in_bbox and in_poly) or (in_bbox and min_dist <= 28.0)

    # Special check: Arabian sea west of coast (longitude < 74.75 is offshore water)
    if lon < 74.74:
        is_inside = False

    if is_inside:
        message = f"Location confirmed inside Dakshina Kannada district (nearest taluk: {nearest_taluk})."
        taluk_assigned = nearest_taluk
    else:
        message = (
            f"Restricted: Selected location ({lat:.4f}, {lon:.4f}) is outside Dakshina Kannada district. "
            f"Nearest Dakshina Kannada taluk is {nearest_taluk} (~{min_dist:.1f} km away). "
            f"TerraVision ML models are trained strictly for Dakshina Kannada. Please select a point within the district."
        )
        taluk_assigned = None

    return GeofenceCheck(
        is_inside_dk=is_inside,
        district="Dakshina Kannada" if is_inside else "Outside Dakshina Kannada",
        taluk=taluk_assigned,
        nearest_taluk=nearest_taluk,
        distance_km=round(min_dist, 2),
        message=message
    )

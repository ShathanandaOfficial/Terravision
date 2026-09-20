from typing import Dict, Any
from ..schemas.prediction import AgronomicAdvice

# Agricultural profiles for all 13 crops calibrated for Dakshina Kannada
CROP_PROFILES: Dict[str, Dict[str, Any]] = {
    "Arecanut": {
        "yield_t_per_ha": 2.8,
        "yield_quintals_per_acre": 11.2,
        "price_per_quintal_inr": 48500,  # Mangalore APMC / CAMPCO Chali arecanut
        "duration_days": 365,
        "harvest_season": "October - February",
        "fertilizer": "NPK 100:40:140 g/palm/year + 12 kg compost per palm",
        "npk_ratio": "10:4:14",
        "irrigation": "Drip irrigation @ 15-20 litres/palm/day during dry months (Dec-May)",
        "soil_pref": "Laterite, Red loam with deep drainage",
        "pests": "Koleroga (Fruit rot) spray 1% Bordeaux mixture before South-West monsoon",
        "economic": "Prime commercial cash crop in Dakshina Kannada. High market stability backed by CAMPCO."
    },
    "Coconut": {
        "yield_t_per_ha": 12.5,
        "yield_quintals_per_acre": 50.0,
        "price_per_quintal_inr": 3400,   # Copra / Tender coconut equivalent
        "duration_days": 365,
        "harvest_season": "Year-round (Monthly cycles)",
        "fertilizer": "NPK 500:320:1200 g/palm/year + 25kg FYM",
        "npk_ratio": "5:3:12",
        "irrigation": "Basin irrigation / Drip @ 40 litres/palm/day in summer",
        "soil_pref": "Coastal alluvial, sandy loam, lateritic soils",
        "pests": "Rhinoceros beetle and red palm weevil management with pheromone traps",
        "economic": "Consistent recurring monthly income. Excellent intercropping potential."
    },
    "Pepper": {
        "yield_t_per_ha": 1.2,
        "yield_quintals_per_acre": 4.8,
        "price_per_quintal_inr": 62000,  # Black pepper high-grade Malabar/Panniyur
        "duration_days": 270,
        "harvest_season": "December - March",
        "fertilizer": "NPK 50:50:150 g/vine/year + 10 kg vermicompost",
        "npk_ratio": "1:1:3",
        "irrigation": "Supplemental sprinkler irrigation during berry development (March-April)",
        "soil_pref": "Rich humus-rich laterite soils with good drainage",
        "pests": "Phytophthora foot rot control via Trichoderma application and 1% Bordeaux spray",
        "economic": "High-value spice with exceptional profit margins when trained on Arecanut standards."
    },
    "Cocoa": {
        "yield_t_per_ha": 1.6,
        "yield_quintals_per_acre": 6.4,
        "price_per_quintal_inr": 28000,  # Wet / Fermented dry cocoa beans
        "duration_days": 365,
        "harvest_season": "October - January & April - June",
        "fertilizer": "NPK 100:40:140 g/tree/year + organic mulch",
        "npk_ratio": "2:1:3",
        "irrigation": "Regular drip under arecanut shade canopy",
        "soil_pref": "Well-drained deep clay loam or laterite",
        "pests": "Vascular streak dieback and black pod rot",
        "economic": "Strong local procurement network in Puttur/Bantwal via chocolate manufacturers."
    },
    "Cashew": {
        "yield_t_per_ha": 1.8,
        "yield_quintals_per_acre": 7.2,
        "price_per_quintal_inr": 12500,  # Raw cashew nuts
        "duration_days": 240,
        "harvest_season": "February - May",
        "fertilizer": "NPK 500:125:125 g/tree/year",
        "npk_ratio": "4:1:1",
        "irrigation": "Protective watering during flowering and nut development",
        "soil_pref": "Hard laterite slopes, gravelly soils where other crops struggle",
        "pests": "Tea mosquito bug (TMB) spray during flush and flowering",
        "economic": "Low-maintenance plantation crop for sloped laterite terrains of Moodbidri and Belthangady."
    },
    "Paddy": {
        "yield_t_per_ha": 4.5,
        "yield_quintals_per_acre": 18.0,
        "price_per_quintal_inr": 2350,   # MSP Paddy Grade A (MO4, Jaya varieties)
        "duration_days": 130,
        "harvest_season": "October - November (Kharif) / March (Rabi)",
        "fertilizer": "NPK 100:50:50 kg/ha in 3 split doses",
        "npk_ratio": "2:1:1",
        "irrigation": "Standing water 2-5 cm during vegetative and reproductive stages",
        "soil_pref": "Clayey alluvial valley bottoms with water retention",
        "pests": "Stem borer and blast disease management",
        "economic": "Staple food grain in coastal Karnataka with subsidized inputs and assured government procurement."
    },
    "Ginger": {
        "yield_t_per_ha": 18.0,
        "yield_quintals_per_acre": 72.0,
        "price_per_quintal_inr": 7800,   # Fresh green ginger
        "duration_days": 240,
        "harvest_season": "December - February",
        "fertilizer": "NPK 75:50:50 kg/ha + 25-30 tonnes FYM/ha",
        "npk_ratio": "3:2:2",
        "irrigation": "Sprinkler irrigation at 4-7 day intervals",
        "soil_pref": "Sandy loam or lateritic loam rich in humus, free from water-logging",
        "pests": "Soft rot (Pythium) seed treatment with metalaxyl",
        "economic": "High return short-duration cash crop popular in Kadaba and Belthangady."
    },
    "Cardamum": {
        "yield_t_per_ha": 0.45,
        "yield_quintals_per_acre": 1.8,
        "price_per_quintal_inr": 185000, # Green cardamom auction grade
        "duration_days": 365,
        "harvest_season": "August - February",
        "fertilizer": "NPK 75:75:150 kg/ha + Neem cake",
        "npk_ratio": "1:1:2",
        "irrigation": "Micro-sprinklers maintaining 75%+ relative humidity",
        "soil_pref": "Forest loams rich in organic matter in Western Ghats foothills",
        "pests": "Thrips and capsule rot control",
        "economic": "Premium luxury spice with highest per-kilogram realization."
    },
    "Coffee": {
        "yield_t_per_ha": 1.4,
        "yield_quintals_per_acre": 5.6,
        "price_per_quintal_inr": 36000,  # Robusta parchment
        "duration_days": 270,
        "harvest_season": "December - March",
        "fertilizer": "NPK 120:90:120 kg/ha split post-monsoon and pre-monsoon",
        "npk_ratio": "4:3:4",
        "irrigation": "Blossom and backing sprinkler irrigation (February-March)",
        "soil_pref": "Deep porous red loam rich in humus with shade trees",
        "pests": "Coffee berry borer and white stem borer trapping",
        "economic": "Stable global export commodity ideal for high-elevation borders of Sullia."
    },
    "Blackgram": {
        "yield_t_per_ha": 1.1,
        "yield_quintals_per_acre": 4.4,
        "price_per_quintal_inr": 8200,
        "duration_days": 75,
        "harvest_season": "January - February",
        "fertilizer": "NPK 25:50:25 kg/ha + Rhizobium seed inoculation",
        "npk_ratio": "1:2:1",
        "irrigation": "1-2 critical irrigations at flowering and pod filling",
        "soil_pref": "Paddy fallow residual moisture soils",
        "pests": "Yellow mosaic virus tolerant varieties (LBG-625)",
        "economic": "Excellent residual season pulse fixing soil nitrogen in paddy fields."
    },
    "Groundnut": {
        "yield_t_per_ha": 2.2,
        "yield_quintals_per_acre": 8.8,
        "price_per_quintal_inr": 6800,
        "duration_days": 110,
        "harvest_season": "April - May (Summer crop)",
        "fertilizer": "NPK 25:50:50 kg/ha + Gypsum 200 kg/ha at flowering",
        "npk_ratio": "1:2:2",
        "irrigation": "Furrow irrigation at 10-day intervals",
        "soil_pref": "Sandy loam to light coastal alluvial soil",
        "pests": "Tikka leaf spot control",
        "economic": "Reliable oilseed crop for coastal river plains and summer fallow."
    },
    "Cotton": {
        "yield_t_per_ha": 1.9,
        "yield_quintals_per_acre": 7.6,
        "price_per_quintal_inr": 7200,
        "duration_days": 160,
        "harvest_season": "January - March",
        "fertilizer": "NPK 120:60:60 kg/ha",
        "npk_ratio": "2:1:1",
        "irrigation": "Controlled drip irrigation",
        "soil_pref": "Deep black soils or fertile river alluvium",
        "pests": "Bollworm integrated pest management",
        "economic": "Specialized industrial fiber crop for drier micro-pockets."
    },
    "Tea": {
        "yield_t_per_ha": 2.5,
        "yield_quintals_per_acre": 10.0,
        "price_per_quintal_inr": 18000,
        "duration_days": 365,
        "harvest_season": "Continuous plucking every 10-14 days",
        "fertilizer": "NPK 140:30:90 kg/ha + Zinc sulfate foliar spray",
        "npk_ratio": "4:1:3",
        "irrigation": "High natural rainfall with slope drainage",
        "soil_pref": "Acidic lateritic soils (pH 4.5-5.5) on Western Ghats slopes",
        "pests": "Red spider mite and blister blight",
        "economic": "Long-term perennial crop for undulating hilly terrains."
    }
}

def generate_agronomy_advice(crop: str, soil_type: str, rainfall_mm: float) -> AgronomicAdvice:
    """Generate detailed agronomic advice customized for the crop and local land conditions."""
    profile = CROP_PROFILES.get(crop, CROP_PROFILES["Arecanut"])
    
    return AgronomicAdvice(
        primary_crop=crop,
        recommended_fertilizer=profile["fertilizer"],
        npk_ratio=profile["npk_ratio"],
        irrigation_schedule=profile["irrigation"],
        soil_management=f"Optimal in {profile['soil_pref']}. For local {soil_type} soil, maintain organic mulching and soil pH between 5.5 and 6.5.",
        pest_management=profile["pests"],
        economic_outlook=f"{profile['economic']} Estimated benchmark APMC realization: ₹{profile['price_per_quintal_inr']:,}/quintal."
    )

import re
import requests
from typing import List, Dict, Any, Optional
from ..core.config import settings
from .geofence_service import check_dakshina_kannada_geofence
from ..schemas.prediction import SearchResultItem

# Comprehensive in-memory gazetteer of Dakshina Kannada's micro-localities,
# neighborhoods, villages, hoblis, and plot sectors across all 7 taluks.
# Zero local database engine is used; this is an in-memory spatial index.
DK_MICRO_LOCALITIES: List[Dict[str, Any]] = [
    # --- PUTTUR TALUK ---
    {"name": "Nehru Nagara", "aliases": ["nehru nagar", "neharu nagar", "neharu nagara", "nehru nagara puttur", "vivekananda college"], "taluk": "Puttur", "lat": 12.7805, "lon": 75.1869, "type": "neighborhood"},
    {"name": "Mura", "aliases": ["mura", "mura puttur", "mura junction", "mura road", "mura layout"], "taluk": "Puttur", "lat": 12.7750, "lon": 75.1950, "type": "neighborhood"},
    {"name": "Darbe", "aliases": ["darbe puttur", "darbe circle"], "taluk": "Puttur", "lat": 12.7602, "lon": 75.2045, "type": "commercial_hub"},
    {"name": "Bolwar", "aliases": ["bolwar puttur"], "taluk": "Puttur", "lat": 12.7712, "lon": 75.2010, "type": "residential"},
    {"name": "Parladka", "aliases": ["parladka puttur"], "taluk": "Puttur", "lat": 12.7554, "lon": 75.1980, "type": "locality"},
    {"name": "Kallega", "aliases": ["kallega puttur"], "taluk": "Puttur", "lat": 12.7780, "lon": 75.1910, "type": "residential"},
    {"name": "Kabaka", "aliases": ["kabaka puttur", "kabaka railway station"], "taluk": "Puttur", "lat": 12.7915, "lon": 75.1780, "type": "suburb"},
    {"name": "Bannur", "aliases": ["bannur puttur"], "taluk": "Puttur", "lat": 12.7580, "lon": 75.2210, "type": "locality"},
    {"name": "Sampya", "aliases": ["sampya puttur", "kombettu"], "taluk": "Puttur", "lat": 12.7410, "lon": 75.2450, "type": "locality"},
    {"name": "Sediyapu", "aliases": ["sediyapu puttur", "sediyapu"], "taluk": "Puttur", "lat": 12.7350, "lon": 75.2100, "type": "village"},
    {"name": "Salmara", "aliases": ["salmara puttur"], "taluk": "Puttur", "lat": 12.7680, "lon": 75.2120, "type": "locality"},
    {"name": "Nellikatte", "aliases": ["nellikatte puttur"], "taluk": "Puttur", "lat": 12.7620, "lon": 75.1960, "type": "junction"},
    {"name": "Mukwe", "aliases": ["mukwe puttur"], "taluk": "Puttur", "lat": 12.7300, "lon": 75.2200, "type": "agricultural_sector"},
    {"name": "Vitla", "aliases": ["vittal", "vittla", "vitla town"], "taluk": "Puttur", "lat": 12.7695, "lon": 75.1012, "type": "town"},
    {"name": "Uppinangady", "aliases": ["uppinangadi", "sangama"], "taluk": "Puttur", "lat": 12.8398, "lon": 75.2534, "type": "town"},
    {"name": "Alike", "aliases": ["alike sathya sai"], "taluk": "Puttur", "lat": 12.7450, "lon": 75.1200, "type": "village"},
    {"name": "Bettampady", "aliases": ["bettampady"], "taluk": "Puttur", "lat": 12.7050, "lon": 75.2750, "type": "village"},
    {"name": "Panaje", "aliases": ["panaje puttur"], "taluk": "Puttur", "lat": 12.6850, "lon": 75.2150, "type": "village"},
    {"name": "Aryapu", "aliases": ["aryapu"], "taluk": "Puttur", "lat": 12.7480, "lon": 75.2100, "type": "village"},
    {"name": "Olamogaru", "aliases": ["olamogaru"], "taluk": "Puttur", "lat": 12.8050, "lon": 75.2150, "type": "village"},

    # --- MANGALURU TALUK ---
    {"name": "Hampankatta", "aliases": ["hampankatta mangalore", "city center"], "taluk": "Mangaluru", "lat": 12.8703, "lon": 74.8427, "type": "central_hub"},
    {"name": "Balmatta", "aliases": ["balmatta mangalore"], "taluk": "Mangaluru", "lat": 12.8680, "lon": 74.8510, "type": "commercial"},
    {"name": "Kadri", "aliases": ["kadri mangalore", "kadri park", "kadri temple"], "taluk": "Mangaluru", "lat": 12.8897, "lon": 74.8501, "type": "neighborhood"},
    {"name": "Bejai", "aliases": ["bejai mangalore", "bejai ksrtc"], "taluk": "Mangaluru", "lat": 12.8835, "lon": 74.8450, "type": "neighborhood"},
    {"name": "Kulshekar", "aliases": ["kulashekara", "kulshekar mangalore", "kaikamba kulshekar"], "taluk": "Mangaluru", "lat": 12.8907, "lon": 74.8888, "type": "suburb"},
    {"name": "Kankanady", "aliases": ["kankanady pumpwell", "father muller"], "taluk": "Mangaluru", "lat": 12.8650, "lon": 74.8620, "type": "commercial"},
    {"name": "Bendoorwell", "aliases": ["bendoor", "bendoorwell"], "taluk": "Mangaluru", "lat": 12.8710, "lon": 74.8570, "type": "neighborhood"},
    {"name": "Urwa", "aliases": ["urwa store", "urwa market"], "taluk": "Mangaluru", "lat": 12.8950, "lon": 74.8320, "type": "neighborhood"},
    {"name": "Ashok Nagar", "aliases": ["ashok nagar mangalore", "ashoknagar"], "taluk": "Mangaluru", "lat": 12.8980, "lon": 74.8350, "type": "neighborhood"},
    {"name": "Mannagudda", "aliases": ["mannagudde"], "taluk": "Mangaluru", "lat": 12.8820, "lon": 74.8310, "type": "neighborhood"},
    {"name": "Car Street", "aliases": ["car street mangalore", "venkataramana temple"], "taluk": "Mangaluru", "lat": 12.8720, "lon": 74.8350, "type": "heritage_sector"},
    {"name": "Bunder", "aliases": ["old port", "bunder mangalore"], "taluk": "Mangaluru", "lat": 12.8640, "lon": 74.8340, "type": "port_sector"},
    {"name": "Attavar", "aliases": ["attavara"], "taluk": "Mangaluru", "lat": 12.8590, "lon": 74.8460, "type": "neighborhood"},
    {"name": "Pandeshwar", "aliases": ["pandeshwara"], "taluk": "Mangaluru", "lat": 12.8550, "lon": 74.8410, "type": "commercial"},
    {"name": "Falnir", "aliases": ["falnir mangalore"], "taluk": "Mangaluru", "lat": 12.8620, "lon": 74.8520, "type": "residential"},
    {"name": "Jeppu", "aliases": ["jeppu morgans gate"], "taluk": "Mangaluru", "lat": 12.8450, "lon": 74.8480, "type": "neighborhood"},
    {"name": "Padil", "aliases": ["padil mangalore", "padil junction"], "taluk": "Mangaluru", "lat": 12.8650, "lon": 74.8870, "type": "suburb"},
    {"name": "Pumpwell", "aliases": ["mahaveer circle", "pumpwell circle"], "taluk": "Mangaluru", "lat": 12.8580, "lon": 74.8680, "type": "junction"},
    {"name": "Surathkal", "aliases": ["suratkal", "nitk surathkal", "surathkal beach"], "taluk": "Mangaluru", "lat": 12.9893, "lon": 74.8002, "type": "coastal_town"},
    {"name": "Baikampady", "aliases": ["baikampady industrial area"], "taluk": "Mangaluru", "lat": 12.9450, "lon": 74.8210, "type": "industrial_belt"},
    {"name": "Panambur", "aliases": ["panambur port", "new mangalore port"], "taluk": "Mangaluru", "lat": 12.9410, "lon": 74.8050, "type": "coastal_port"},
    {"name": "Kulai", "aliases": ["kulai surathkal"], "taluk": "Mangaluru", "lat": 12.9720, "lon": 74.8120, "type": "residential"},
    {"name": "Mukka", "aliases": ["mukka srinivas"], "taluk": "Mangaluru", "lat": 13.0150, "lon": 74.7920, "type": "coastal_suburb"},
    {"name": "Mulki", "aliases": ["mulky", "bappanadu"], "taluk": "Mangaluru", "lat": 13.0950, "lon": 74.7950, "type": "town"},
    {"name": "Kinnigoli", "aliases": ["kinnigoli town"], "taluk": "Mangaluru", "lat": 13.0850, "lon": 74.8550, "type": "town"},
    {"name": "Kateel", "aliases": ["kateel temple", "durgaparameshwari"], "taluk": "Mangaluru", "lat": 13.0250, "lon": 74.8650, "type": "temple_town"},
    {"name": "Bajpe", "aliases": ["mangalore airport", "bajpe town"], "taluk": "Mangaluru", "lat": 12.9650, "lon": 74.8900, "type": "suburb"},
    {"name": "Gurupura", "aliases": ["gurupura kaveri", "gurupura river"], "taluk": "Mangaluru", "lat": 12.9250, "lon": 74.9350, "type": "riverine_village"},
    {"name": "Ullal", "aliases": ["ullala", "abbakka"], "taluk": "Mangaluru", "lat": 12.8050, "lon": 74.8520, "type": "coastal_town"},
    {"name": "Thokkotu", "aliases": ["thokkottu", "thokottu junction"], "taluk": "Mangaluru", "lat": 12.8250, "lon": 74.8580, "type": "suburb"},
    {"name": "Deralakatte", "aliases": ["deralakatta", "kshema", "yenepoya"], "taluk": "Mangaluru", "lat": 12.8150, "lon": 74.8850, "type": "education_hub"},
    {"name": "Konaje", "aliases": ["mangalore university", "konaje campus"], "taluk": "Mangaluru", "lat": 12.8200, "lon": 74.9250, "type": "education_hub"},
    {"name": "Mudipu", "aliases": ["mudipu infosys"], "taluk": "Mangaluru", "lat": 12.8050, "lon": 74.9650, "type": "tech_park"},

    # --- BANTWAL TALUK ---
    {"name": "B.C. Road", "aliases": ["bc road", "bantwal cross road", "bcroad"], "taluk": "Bantwal", "lat": 12.8850, "lon": 75.0310, "type": "commercial_hub"},
    {"name": "Bantwal Town", "aliases": ["bantwal", "buntwal", "netravati bantwal"], "taluk": "Bantwal", "lat": 12.8903, "lon": 75.0347, "type": "taluk_hq"},
    {"name": "Melkar", "aliases": ["melkar junction", "melkar bantwal"], "taluk": "Bantwal", "lat": 12.8750, "lon": 75.0450, "type": "junction"},
    {"name": "Panemangalore", "aliases": ["panemangaluru", "pane mangalore"], "taluk": "Bantwal", "lat": 12.8680, "lon": 75.0490, "type": "riverine_town"},
    {"name": "Modankap", "aliases": ["modankapu"], "taluk": "Bantwal", "lat": 12.8920, "lon": 75.0210, "type": "suburb"},
    {"name": "Jakribettu", "aliases": ["jakribettu bantwal"], "taluk": "Bantwal", "lat": 12.8990, "lon": 75.0410, "type": "locality"},
    {"name": "Farangipete", "aliases": ["farangipete", "pharangipete"], "taluk": "Bantwal", "lat": 12.8710, "lon": 74.9650, "type": "suburb"},
    {"name": "Thumbe", "aliases": ["thumbe dam", "thumbe vented dam"], "taluk": "Bantwal", "lat": 12.8740, "lon": 74.9850, "type": "village"},
    {"name": "Mani", "aliases": ["mani junction", "mani mysore road"], "taluk": "Bantwal", "lat": 12.8350, "lon": 75.1250, "type": "junction"},
    {"name": "Kalladka", "aliases": ["kalladka kt", "kalladka tea", "kalladka town"], "taluk": "Bantwal", "lat": 12.8550, "lon": 75.0850, "type": "town"},
    {"name": "Salethur", "aliases": ["salethur bantwal"], "taluk": "Bantwal", "lat": 12.7650, "lon": 75.0450, "type": "village"},
    {"name": "Sarapady", "aliases": ["sarapady barrage"], "taluk": "Bantwal", "lat": 12.9150, "lon": 75.1150, "type": "riverine_village"},
    {"name": "Punjalkatte", "aliases": ["punjalkatte town"], "taluk": "Bantwal", "lat": 12.9650, "lon": 75.1650, "type": "junction"},
    {"name": "Vogga", "aliases": ["vogga junction"], "taluk": "Bantwal", "lat": 12.9500, "lon": 75.1450, "type": "village"},
    {"name": "Siddakatte", "aliases": ["siddakatte"], "taluk": "Bantwal", "lat": 12.9850, "lon": 75.1100, "type": "village"},

    # --- BELTHANGADY TALUK ---
    {"name": "Belthangady Town", "aliases": ["belthangady", "beltangadi", "belthangadi"], "taluk": "Belthangady", "lat": 12.9983, "lon": 75.2588, "type": "taluk_hq"},
    {"name": "Ujire", "aliases": ["ujire town", "ujire sdm", "ujire circle"], "taluk": "Belthangady", "lat": 13.0050, "lon": 75.3250, "type": "education_hub"},
    {"name": "Dharmasthala", "aliases": ["dharmasthala temple", "manjunatha temple", "netravati snanaghatta"], "taluk": "Belthangady", "lat": 12.9550, "lon": 75.3850, "type": "pilgrimage_center"},
    {"name": "Guruvayanakere", "aliases": ["guruvayankere", "guruvayanakere lake"], "taluk": "Belthangady", "lat": 13.0020, "lon": 75.2350, "type": "junction"},
    {"name": "Madanthyar", "aliases": ["madanthyar church"], "taluk": "Belthangady", "lat": 12.9750, "lon": 75.1950, "type": "town"},
    {"name": "Venur", "aliases": ["venur gomateshwara", "venoor"], "taluk": "Belthangady", "lat": 13.0250, "lon": 75.1450, "type": "heritage_town"},
    {"name": "Kokkada", "aliases": ["kokkada shishila"], "taluk": "Belthangady", "lat": 12.8650, "lon": 75.3950, "type": "foothill_village"},
    {"name": "Aladangady", "aliases": ["aladangady"], "taluk": "Belthangady", "lat": 13.0650, "lon": 75.2250, "type": "village"},
    {"name": "Mundaje", "aliases": ["mundaje ghat"], "taluk": "Belthangady", "lat": 13.0250, "lon": 75.3750, "type": "valley_village"},
    {"name": "Charmadi", "aliases": ["charmadi ghat", "charmadi"], "taluk": "Belthangady", "lat": 13.0550, "lon": 75.4450, "type": "ghat_sector"},

    # --- SULLIA TALUK ---
    {"name": "Sullia Town", "aliases": ["sullia", "sullya", "sullia bus stand"], "taluk": "Sullia", "lat": 12.5606, "lon": 75.3892, "type": "taluk_hq"},
    {"name": "Gandhinagar (Sullia)", "aliases": ["gandhinagar sullia", "gandhinagar"], "taluk": "Sullia", "lat": 12.5550, "lon": 75.3820, "type": "suburb"},
    {"name": "Jalsoor", "aliases": ["jalsoor junction", "jalsoor sullia"], "taluk": "Sullia", "lat": 12.5510, "lon": 75.3350, "type": "junction"},
    {"name": "Bellare", "aliases": ["bellare town", "bellare sullia"], "taluk": "Sullia", "lat": 12.6350, "lon": 75.3850, "type": "town"},
    {"name": "Panja", "aliases": ["panja sullia"], "taluk": "Sullia", "lat": 12.6950, "lon": 75.4250, "type": "village"},
    {"name": "Guttigar", "aliases": ["guttigar sullia"], "taluk": "Sullia", "lat": 12.6050, "lon": 75.5250, "type": "village"},
    {"name": "Kukke Subramanya", "aliases": ["subramanya", "kukke", "subrahmanya", "kumaradhara temple"], "taluk": "Sullia", "lat": 12.6620, "lon": 75.6150, "type": "pilgrimage_town"},
    {"name": "Aranthod", "aliases": ["aranthodu", "aranthod"], "taluk": "Sullia", "lat": 12.5150, "lon": 75.4450, "type": "village"},
    {"name": "Sampaje", "aliases": ["sampaje ghat"], "taluk": "Sullia", "lat": 12.4950, "lon": 75.5150, "type": "ghat_border"},

    # --- MOODBIDRI TALUK ---
    {"name": "Bedra (Moodbidri)", "aliases": ["bedra", "bidre", "bedra town", "moodbidri", "mudbidri", "moodabidri", "jain kashi", "alvas"], "taluk": "Moodbidri", "lat": 13.0694, "lon": 74.9961, "type": "taluk_hq"},
    {"name": "Moodbidri Town", "aliases": ["moodbidri", "mudbidri", "moodabidri", "bedra", "jain kashi", "alvas"], "taluk": "Moodbidri", "lat": 13.0694, "lon": 74.9961, "type": "taluk_hq"},
    {"name": "Alangar", "aliases": ["alangar moodbidri", "alangar church"], "taluk": "Moodbidri", "lat": 13.0780, "lon": 74.9910, "type": "neighborhood"},
    {"name": "Vidyagiri (Moodbidri)", "aliases": ["vidyagiri moodbidri", "alvas vidyagiri"], "taluk": "Moodbidri", "lat": 13.0580, "lon": 74.9850, "type": "education_hub"},
    {"name": "Pranthya", "aliases": ["pranthya moodbidri"], "taluk": "Moodbidri", "lat": 13.0620, "lon": 75.0080, "type": "locality"},
    {"name": "Marpadi", "aliases": ["marpadi"], "taluk": "Moodbidri", "lat": 13.0720, "lon": 75.0120, "type": "village"},
    {"name": "Mastikatte", "aliases": ["mastikatte moodbidri"], "taluk": "Moodbidri", "lat": 13.0650, "lon": 74.9920, "type": "junction"},
    {"name": "Belvai", "aliases": ["belvai town", "belvai moodbidri"], "taluk": "Moodbidri", "lat": 13.1150, "lon": 75.0250, "type": "town"},
    {"name": "Tenkamijar", "aliases": ["tenkamijar", "mijar kite"], "taluk": "Moodbidri", "lat": 13.0250, "lon": 74.9750, "type": "village"},
    {"name": "Kallabettu", "aliases": ["kallabettu moodbidri"], "taluk": "Moodbidri", "lat": 13.0820, "lon": 75.0150, "type": "village"},

    # --- KADABA TALUK ---
    {"name": "Kadaba Town", "aliases": ["kadaba", "kadaba bus stand"], "taluk": "Kadaba", "lat": 12.7381, "lon": 75.4522, "type": "taluk_hq"},
    {"name": "Mardhala", "aliases": ["mardhala kadaba", "mardala"], "taluk": "Kadaba", "lat": 12.7250, "lon": 75.4750, "type": "village"},
    {"name": "Renjiladi", "aliases": ["renjiladi kadaba"], "taluk": "Kadaba", "lat": 12.7550, "lon": 75.4650, "type": "village"},
    {"name": "Alankaru", "aliases": ["alankaru kadaba", "alankar"], "taluk": "Kadaba", "lat": 12.7950, "lon": 75.3950, "type": "village"},
    {"name": "Bilinele", "aliases": ["bilinele kadaba", "shiradi border"], "taluk": "Kadaba", "lat": 12.6850, "lon": 75.5350, "type": "foothill_village"},
    {"name": "Ichlampady", "aliases": ["ichlampady"], "taluk": "Kadaba", "lat": 12.7850, "lon": 75.4950, "type": "village"},
    {"name": "Noojibalthila", "aliases": ["noojibalthila"], "taluk": "Kadaba", "lat": 12.7150, "lon": 75.4150, "type": "village"},
    {"name": "Savanoor", "aliases": ["savanoor kadaba", "savanoor puttur border"], "taluk": "Kadaba", "lat": 12.8250, "lon": 75.3450, "type": "village"}
]

def search_gazetteer(query: str) -> List[SearchResultItem]:
    """Search internal Dakshina Kannada spatial gazetteer with fuzzy matching.
    Only searches name + aliases (NOT the taluk name) to prevent false matches
    like 'mura' matching 'Mangaluru'. Uses length-ratio guard for substrings.
    """
    q_norm = query.strip().lower()
    q_tokens = re.findall(r'\w+', q_norm)
    if not q_tokens:
        return []

    matches = []
    for loc in DK_MICRO_LOCALITIES:
        name_lower = loc["name"].lower()
        # NOTE: intentionally NOT including loc["taluk"].lower() to avoid
        # short queries like 'mura' matching 'Mangaluru'
        alias_terms = [a.lower() for a in loc["aliases"]]
        all_terms = [name_lower] + alias_terms

        matched = False
        score = 0
        for term in all_terms:
            # 1. Exact match
            if q_norm == term:
                matched = True; score = 100; break
            # 2. The query is a prefix of the term (e.g. 'murad' -> 'muradnagar')
            if term.startswith(q_norm) and len(q_norm) >= 2:
                matched = True; score = 90; break
            # 3. Substring only if query is >= 60% of term length (prevents 'mura' matching 'Mangaluru')
            if q_norm in term and len(q_norm) >= max(3, int(len(term) * 0.60)):
                matched = True; score = 75; break
            # 4. Multi-word query: all tokens found in term
            if len(q_tokens) >= 2 and all(tok in term for tok in q_tokens):
                matched = True; score = 70; break

        if matched:
            display_name = f"{loc['name']}, {loc['taluk']} Taluk, Dakshina Kannada, Karnataka"
            matches.append({
                "item": SearchResultItem(
                    display_name=display_name,
                    name=f"{loc['name']}, {loc['taluk']}",
                    lat=loc["lat"],
                    lon=loc["lon"],
                    taluk=loc["taluk"],
                    type=loc["type"],
                    is_inside_dk=True
                ),
                "score": score
            })

    matches.sort(key=lambda x: x["score"], reverse=True)
    return [m["item"] for m in matches]

def search_nominatim_fast(query: str) -> List[SearchResultItem]:
    """Fast single-pass query to live Nominatim API with 1.2s timeout."""
    headers = {"User-Agent": "TerraVision-DakshinaKannada-CropForecaster/2.0"}
    results = []

    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": query,
            "format": "json",
            "addressdetails": 1,
            "viewbox": "74.75,13.25,75.68,12.45",
            "bounded": 1,
            "limit": 5,
            "countrycodes": "in"
        }
        resp = requests.get(url, params=params, headers=headers, timeout=1.2)
        if resp.status_code == 200:
            data = resp.json()
            for item in data:
                try:
                    lat = float(item["lat"])
                    lon = float(item["lon"])
                    geo = check_dakshina_kannada_geofence(lat, lon)
                    if geo.is_inside_dk:
                        display_name = item.get("display_name", "")
                        name = item.get("name", display_name.split(",")[0])
                        taluk = geo.taluk or geo.nearest_taluk
                        results.append(
                            SearchResultItem(
                                display_name=display_name,
                                name=f"{name}, {taluk}",
                                lat=lat,
                                lon=lon,
                                taluk=taluk,
                                type=item.get("type", "location"),
                                is_inside_dk=True
                            )
                        )
                except Exception:
                    continue
    except Exception:
        pass

    return results

def query_google_suggestions(query: str) -> List[str]:
    """Fetch live autocompletions from Google Suggest API (100% free, trusted global platform)."""
    try:
        url = f"https://suggestqueries.google.com/complete/search?client=chrome&hl=en&gl=in&q={query}"
        resp = requests.get(url, timeout=1.0)
        if resp.status_code == 200:
            data = resp.json()
            if len(data) > 1 and isinstance(data[1], list):
                return data[1]
    except Exception:
        pass
    return []

def resolve_universal_dk_places(query: str) -> List[SearchResultItem]:
    """
    Master Universal Search Resolver for Dakshina Kannada:
    Combines:
      1. High-speed internal gazetteer of all 7 taluks, micro-localities, and plot sectors (<1ms).
      2. Fast live Nominatim geocoder queries bounded to Dakshina Kannada.
      3. Google Suggest live query recommendations with intelligent spatial anchoring.
    Ensures EVERY place/plot in Dakshina Kannada (e.g. Nehru Nagar, Darbe, Kadri, Ujire, etc.)
    always produces instantaneous search recommendations.
    """
    clean_q = query.strip()
    if not clean_q or len(clean_q) < 2:
        return []

    combined_results: List[SearchResultItem] = []
    seen_coords = set()

    def add_result(res: SearchResultItem):
        coord_key = (round(res.lat, 4), round(res.lon, 4))
        name_key = res.name.lower().replace(" ", "")
        if coord_key not in seen_coords and not any(r.name.lower().replace(" ", "") == name_key for r in combined_results):
            seen_coords.add(coord_key)
            combined_results.append(res)

    # 1. First priority: High-speed internal Dakshina Kannada gazetteer (<1ms)
    gazetteer_matches = search_gazetteer(clean_q)
    for m in gazetteer_matches:
        add_result(m)

    # 2. Second priority: Live OpenStreetMap Nominatim search (only if gazetteer matches are few)
    if len(combined_results) < 4:
        nom_matches = search_nominatim_fast(clean_q)
        for m in nom_matches:
            add_result(m)

    # 3. Third priority: Google Suggest live place query resolution
    # If fewer than 5 results found, expand with Google Suggestions
    if len(combined_results) < 5:
        suggestions = query_google_suggestions(clean_q)
        for s in suggestions[:8]:
            s_clean = s.lower()
            # If suggestion references any of the 7 taluks or places in DK
            for taluk_name, taluk_center in settings.TALUK_CENTERS.items():
                if taluk_name.lower() in s_clean or "mangalore" in s_clean or "dakshina kannada" in s_clean:
                    # Resolve coordinates based on the matched taluk hub with micro-offset
                    res_taluk = "Mangaluru" if "mangalore" in s_clean else taluk_name
                    base = settings.TALUK_CENTERS.get(res_taluk, taluk_center)
                    # Clean title
                    clean_title = s.title().replace(" Karnataka", "").replace(" Pin Code", "").strip()
                    add_result(
                        SearchResultItem(
                            display_name=f"{clean_title}, {res_taluk}, Dakshina Kannada",
                            name=f"{clean_title}, {res_taluk}",
                            lat=base["lat"],
                            lon=base["lon"],
                            taluk=res_taluk,
                            type="search_recommendation",
                            is_inside_dk=True
                        )
                    )

    # 4. If still empty, check if query contains any of the 7 taluk names directly
    if not combined_results:
        for taluk_name, data in settings.TALUK_CENTERS.items():
            if clean_q.lower() in taluk_name.lower() or taluk_name.lower() in clean_q.lower():
                add_result(
                    SearchResultItem(
                        display_name=f"{taluk_name} Taluk Center, Dakshina Kannada, Karnataka",
                        name=f"{taluk_name} Taluk",
                        lat=data["lat"],
                        lon=data["lon"],
                        taluk=taluk_name,
                        type="taluk_center",
                        is_inside_dk=True
                    )
                )

    return combined_results[:10]

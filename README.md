# TerraVision v2.0.0 - Hybrid Crop Yield Forecasting System

**Intelligent Satellite Intelligence for Dakshina Kannada Agricultural Region**

## 🌍 Project Overview

TerraVision is an advanced AI-powered geospatial system that combines satellite imagery, climate data, and machine learning to provide precise crop yield forecasting and recommendations for farmers in Dakshina Kannada, Karnataka, India. Using a sophisticated hybrid multi-modal inference engine, the system delivers sub-meter precision farm boundary detection and NASA-grade agricultural intelligence.

### Key Features
- **Satellite-Based Farm Mapping**: Sub-meter precision boundary detection using Sentinel-2 satellite imagery
- **Real-Time Climate Integration**: Live weather data and historical climate patterns from Open-Meteo API
- **Hybrid ML Architecture**: Three-phase ensemble model combining XGBoost, RandomForest, and ExtraTrees fusion
- **Geofence-Restricted**: Specialized predictions for Dakshina Kannada's 7 taluks
- **Agronomy AI**: Soil-type and crop-specific recommendations with disease prevention
- **Interactive Dashboard**: Modern, responsive web interface with real-time analysis
- **Prediction History**: Track and revisit past analyses with local storage

---

## 🏗️ Project Architecture

### System Components

```
Terravision-main/
├── backend/                          # FastAPI Python backend
│   ├── app/
│   │   ├── main.py                   # FastAPI application entry point
│   │   ├── api/
│   │   │   └── routes.py             # REST API endpoints
│   │   ├── core/
│   │   │   └── config.py             # Configuration & Dakshina Kannada boundaries
│   │   ├── schemas/
│   │   │   └── prediction.py         # Pydantic data models
│   │   └── services/
│   │       ├── model_service.py      # Hybrid ML inference engine
│   │       ├── climate_satellite_service.py  # Sentinel-2 & Open-Meteo integration
│   │       ├── agronomy_service.py   # Crop recommendations
│   │       ├── geocoding_service.py  # Location search (Nominatim, Google)
│   │       └── geofence_service.py   # Dakshina Kannada boundary validation
│   └── requirements.txt              # Python dependencies
│
├── frontend/                         # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── App.jsx                   # Main application component
│   │   ├── App.css                   # Application styling
│   │   ├── main.jsx                  # React entry point
│   │   ├── index.css                 # Global styles
│   │   └── components/
│   │       ├── Navbar.jsx            # Navigation bar
│   │       ├── DashboardView.jsx     # Landing dashboard
│   │       ├── HighPrecisionFarmPicker.jsx  # Interactive map & boundary drawing
│   │       ├── AnalysisScanner.jsx   # Animated scanning UI
│   │       ├── ResultsView.jsx       # AI analysis results display
│   │       ├── HistoryView.jsx       # Prediction history
│   │       ├── ModelsView.jsx        # Model information & metrics
│   │       ├── AboutView.jsx         # About/help view
│   │       ├── GeofenceModal.jsx     # Out-of-bounds error handling
│   │       ├── MetricsModal.jsx      # Model performance metrics
│   │       ├── MapboxFarmPicker.jsx  # Mapbox integration
│   │       ├── MapPicker.jsx         # Leaflet map component
│   │       ├── ClimateDiagnostics.jsx # Climate data visualization
│   │       ├── AgronomyCard.jsx      # Agronomy recommendations
│   │       ├── PredictionHUD.jsx     # Prediction display HUD
│   │       ├── SatelliteRadar.jsx    # Satellite data visualization
│   │       ├── SearchControl.jsx     # Location search
│   │       └── More UI Components...
│   ├── public/                       # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── package.json                  # NPM dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── .oxlintrc.json                # Oxlint linting rules
│   └── index.html                    # HTML entry point
│
└── Model Zip/                        # Pre-trained ML models
    ├── phase3_artifacts_v2.0/        # Phase 3: Meta-Fusion Model (88.29% accuracy)
    ├── phase2_fusion_artifacts/      # Phase 2: Satellite RF Model
    └── Phase1_numericle_artifacts/   # Phase 1: Tabular XGBoost Model
```

### Application Flow

1. **User selects location** on interactive satellite map
2. **Draws farm boundary** using Mapbox drawing tools
3. **System validates** geofence (must be in Dakshina Kannada)
4. **Backend processes** multi-modal data:
   - Phase 1: Tabular data (location, season, soil type) → XGBoost
   - Phase 2: Satellite spectral indices (NDVI, NDBI, NDRE, etc.) → RandomForest
   - Phase 3: Fusion of both predictions → ExtraTrees meta-model
5. **Results displayed** with crop recommendations, yield forecast, agronomy advice
6. **History saved** to browser localStorage

---

## 🔧 Backend Architecture

### Technology Stack
- **Framework**: FastAPI 0.115+
- **Server**: Uvicorn 0.30+
- **ML Libraries**: scikit-learn, XGBoost, LightGBM, joblib
- **Data Processing**: pandas, numpy
- **Data Validation**: Pydantic 2.7+
- **HTTP Client**: requests, httpx

### Key Backend Services

#### 1. **Model Service** (`model_service.py`)
Hybrid Predictor Engine that orchestrates three ML models:
- **Phase 1 Model**: XGBoost on tabular features (location, season, soil type, irrigation)
- **Phase 2 Model**: RandomForest on satellite spectral data (NDVI, NDBI, NDRE, GNDVI, BSI)
- **Phase 3 Model**: ExtraTrees fusion model combining both predictions
- **Accuracy**: 88.29% on Dakshina Kannada test data

**Feature Engineering**:
- Categorical encoding for location, season, soil type
- Spectral indices from Sentinel-2 bands
- Temporal climate features from Open-Meteo
- Elevation and agro-climatic zone classification

#### 2. **Climate & Satellite Service** (`climate_satellite_service.py`)
Integrates:
- **Open-Meteo API**: Real-time and historical weather data
- **Sentinel-2**: Cloud-free satellite imagery and spectral indices
- **Elevation Data**: SRTM for terrain classification
- **Agro-Climatic Zones**: Assigns 7 regional zones for Dakshina Kannada

#### 3. **Agronomy Service** (`agronomy_service.py`)
Generates crop-specific recommendations:
- Soil type compatibility
- Rainfall adequacy
- Seasonal suitability
- Disease prevention strategies
- Fertilizer schedules
- Irrigation requirements

#### 4. **Geocoding Service** (`geocoding_service.py`)
Multi-source location search:
- Nominatim (OpenStreetMap)
- Google Places (fallback)
- Gazetteer database (local DK places)
- Fuzzy matching for agriculture-specific locations

#### 5. **Geofence Service** (`geofence_service.py`)
**Critical**: Validates that predictions are within Dakshina Kannada
- Point-in-polygon validation
- Haversine distance calculations
- Boundary box quick culling
- Returns taluk assignment and geofence status

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Health check & system info |
| GET | `/api/check-geofence` | Validate location within DK |
| POST | `/api/predict` | Main prediction endpoint |
| GET | `/api/search-places` | Location search |
| GET | `/api/reverse-geocode` | Coordinates to place name |
| GET | `/api/metrics` | Model performance metrics |

**Main Prediction Endpoint** (`POST /api/predict`):
```json
{
  "lat": 12.7667,
  "lon": 75.2000,
  "place_name": "Puttur Agricultural Sector",
  "taluk": "Puttur",
  "area_acres": 2.34
}
```

Response includes:
- Recommended crop type
- Yield forecast (per acre and per hectare)
- Confidence scores
- Climate diagnostics
- Satellite imagery analysis
- Agronomy recommendations

---

## 💻 Frontend Architecture

### Technology Stack
- **Framework**: React 19.2.8
- **Build Tool**: Vite 8.3.0
- **Styling**: Tailwind CSS 4.3.3 + custom CSS
- **Maps**: Mapbox GL 3.31.0, Leaflet 1.9.4
- **Drawing Tools**: Mapbox GL Draw 1.5.2
- **Geospatial**: Turf.js 7.4.0
- **Icons**: Lucide React 1.47.0
- **Animations**: canvas-confetti 1.9.4
- **Linting**: Oxlint 1.81.0

### Component Hierarchy

```
App.jsx (main state container)
├── Navbar (navigation & metrics)
├── DashboardView (landing page)
├── Analyze View (3-step flow)
│   ├── HighPrecisionFarmPicker (map + drawing)
│   ├── AnalysisScanner (animated loader)
│   └── ResultsView (predictions display)
├── HistoryView (past predictions)
├── ModelsView (model information)
├── AboutView (help & documentation)
├── GeofenceModal (error handling)
└── MetricsModal (model performance)
```

### UI/UX Design Language
- **Color Scheme**: Deep space theme (dark navy/black with blue accents)
- **Typography**: Space Grotesk font family for headings
- **Components**: Glass-morphism cards with Tailwind utilities
- **Animations**: Smooth transitions, animated status indicators
- **Responsive**: Mobile-first, adapts to all screen sizes

### Key Component Features

**HighPrecisionFarmPicker**:
- Real-time interactive Mapbox satellite map
- Polygon drawing for farm boundaries
- Area calculation in acres/hectares
- Location search integration
- Current location detection

**AnalysisScanner**:
- Multi-stage scanning animation
- Satellite data processing visualization
- Climate data fetching animation
- Model inference progress indicators

**ResultsView**:
- Crop recommendation with confidence
- Yield forecast with confidence intervals
- Climate diagnostics dashboard
- Satellite spectral analysis charts
- Agronomy recommendations cards
- Model breakdown (Phase 1, 2, 3 scores)

**HistoryView**:
- Table of past 20 predictions
- Quick rerun functionality
- Export/download capability (future)

---

## 🌾 Dakshina Kannada Specialization

### Geographic Configuration
- **Latitude Range**: 12.45° N to 13.25° N
- **Longitude Range**: 74.75° E to 75.68° E
- **7 Taluks** (administrative divisions):
  1. **Mangaluru** - Coastal lowland (elevation: 22m)
  2. **Bantwal** - Midland river valley (36m)
  3. **Belthangady** - Western Ghats foothills (86m)
  4. **Puttur** - Midland plantation belt (90m)
  5. **Sullia** - Highland Ghats border (115m)
  6. **Moodbidri** - Northern midland plateaus (54m)
  7. **Kadaba** - Kumaradhara river basin (102m)

### Agro-Climatic Zones
- Coastal Lowland (rice, coconut)
- Midland River Valley (arecanut, coconut)
- Western Ghats Foothill (spices, coffee)
- Midland Plantation Belt (coconut, arecanut)
- Highland Ghats Border (coffee, spices)
- Northern Midland Plateaus (arecanut, coconut)
- Kumaradhara River Basin (mixed farming)

### Supported Crops
System trained on regional crop varieties:
- Rice, Coconut, Arecanut, Coffee, Pepper, Cardamom, Cocoa, Banana, Sugarcane, and more

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.9+** (backend)
- **Node.js 18+** (frontend)
- **npm or yarn** (frontend package manager)
- **Model files** (included in `Model Zip/` directory)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start FastAPI server**:
   ```bash
   python -m app.main
   ```
   Server runs on `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file** (optional, for API configuration):
   ```
   VITE_API_URL=http://localhost:8000
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📊 Model Architecture

### Three-Phase Hybrid Ensemble

#### Phase 1: Tabular XGBoost Model
- **Input**: Location, season, soil type, irrigation status
- **Output**: Yield prediction
- **Optimization**: Hyperparameter tuned for agricultural data

#### Phase 2: Satellite Spectral RandomForest Model
- **Input**: Sentinel-2 spectral indices:
  - NDVI (Normalized Difference Vegetation Index)
  - NDBI (Normalized Difference Built-up Index)
  - NDRE (Normalized Difference Red Edge Index)
  - GNDVI (Green Normalized Difference Vegetation Index)
  - BSI (Bare Soil Index)
- **Output**: Yield prediction from satellite data
- **Optimization**: Tuned on cloud-free Sentinel-2 composites

#### Phase 3: ExtraTrees Meta-Fusion Model
- **Input**: Predictions from Phase 1 & Phase 2
- **Output**: Final fused prediction
- **Accuracy**: **88.29%** on Dakshina Kannada test set
- **Advantage**: Combines tabular and spectral information for robust predictions

### Model Performance
- **Overall Accuracy**: 88.29%
- **Dataset**: 1000+ labeled farm records from Dakshina Kannada
- **Cross-Validation**: 5-fold stratified validation
- **Test Set**: 20% holdout with representative taluk distribution

---

## 🔐 Data Privacy & Security

- **Frontend**: All history stored in browser localStorage (no cloud)
- **Backend**: CORS enabled for local development (configure for production)
- **API**: No authentication required for development (add JWT for production)
- **Sensitive Data**: Climate API keys should be stored in environment variables

---

## 🛠️ Development Workflow

### Code Quality
- **Frontend Linting**: Oxlint enabled (ESLint alternative by Oxc)
  ```bash
  npm run lint
  ```

### Running Tests
- **Backend**: No test suite included (recommended addition)
- **Frontend**: No test suite included (recommended addition)

### Common Issues

**Issue**: "Network error or backend connection failed"
- **Solution**: Ensure FastAPI is running on `http://localhost:8000`

**Issue**: "Selected location cannot be predicted" (Geofence Error)
- **Solution**: Location must be within Dakshina Kannada boundaries

**Issue**: Model files not found
- **Solution**: Ensure `Model Zip/` directory exists with all phase artifacts

---

## 📁 Configuration

### Backend Config (`app/core/config.py`)
- District name and boundaries
- Taluk coordinates and metadata
- DK polygon for geofencing
- Model directory paths
- API versioning

### Frontend Config (`vite.config.js`)
- Vite optimization settings
- React plugin configuration
- Build output options

---

## 🚢 Deployment Considerations

### Production Checklist
- [ ] Add authentication/authorization
- [ ] Use environment variables for sensitive data
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Add rate limiting on API endpoints
- [ ] Implement request logging and monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure database for history (instead of localStorage)
- [ ] Add comprehensive test suite
- [ ] Set up CI/CD pipeline

### Deployment Platforms
- **Backend**: Deploy to AWS EC2, Heroku, or DigitalOcean
- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages

---

## 📚 Technology References

### Key Libraries & APIs
- **FastAPI**: https://fastapi.tiangolo.com/
- **React**: https://react.dev/
- **Mapbox GL JS**: https://docs.mapbox.com/mapbox-gl-js/
- **Tailwind CSS**: https://tailwindcss.com/
- **Sentinel-2 Data**: https://scihub.copernicus.eu/
- **Open-Meteo API**: https://open-meteo.com/

---

## 📞 Support & Contributing

For issues or contributions:
1. Document the problem clearly
2. Provide reproduction steps
3. Submit via GitHub issues
4. Include logs and error messages

---

## 📝 License

TerraVision v2.0 - Agricultural Intelligence System for Dakshina Kannada

---

## 🎯 Future Enhancements

- [ ] Multi-region expansion (other districts/states)
- [ ] Real-time price forecasting
- [ ] Insurance-integrated recommendations
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (Deep Learning with CNN)
- [ ] Weather alert system
- [ ] Pest and disease detection via image classification
- [ ] Water resource optimization
- [ ] Soil health monitoring
- [ ] Blockchain for yield certification

---

**Powered by NASA-grade Satellite Intelligence • Open-Meteo Climate Data • ExtraTrees Meta-Fusion ML (88.29% Accuracy)**

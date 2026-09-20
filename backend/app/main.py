from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Hybrid Crop Yield Forecasting & Recommendation System using Satellite Imagery and Numerical Data - Specialized for Dakshina Kannada, Karnataka"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {
        "system": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "region": settings.DISTRICT_NAME,
        "status": "ONLINE",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

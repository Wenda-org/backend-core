from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, user_routes, categories, destinations, reviews, favorites, trips, search, map, admin
from app.database.connection import Base, engine
from app.models import user, category, destination, review, favorite, trip, user_preferences

app = FastAPI(
    title="Wenda API - Tourism Platform",
    description="API for Wenda mobile app - Discover Angola's tourist destinations",
    version="1.0.0"
)

origins = [
    "http://127.0.0.1:8000",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://backend-core-rzxx.onrender.com",
    "https://wenda.ao",
    "https://admin.wenda.ao",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(auth.router)
app.include_router(user_routes.router)
app.include_router(categories.router)
app.include_router(destinations.router)
app.include_router(reviews.router)
app.include_router(favorites.router)
app.include_router(trips.router)
app.include_router(search.router)
app.include_router(map.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "message": "Wenda API running successfully!",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "service": "wenda-api",
        "version": "1.0.0"
    }

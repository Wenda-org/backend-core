from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.database.connection import Base, engine
from app.models import user

app = FastAPI(title="Wenda API - Auth Module")

origins = [
    "http://127.0.0.1:8000",
    "http://localhost:3000",
     "https://backend-core-rzxx.onrender.com", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Wenda API running successfully!"}

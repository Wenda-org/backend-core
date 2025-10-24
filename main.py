from fastapi import FastAPI
from app.routes import user_routes
from app.database.connection import Base, engine
from app.models import user

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Backend Core")

app.include_router(user_routes.router)

@app.get("/")

def root():
    return {"message": "FastAPI backend funcionando!"}


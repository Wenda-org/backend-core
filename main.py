from fastapi import FastAPI
from app.routes import auth
from app.database.connection import Base, engine
from app.models import user

app = FastAPI(title="Wenda API - Auth Module")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Wenda API running successfully!"}

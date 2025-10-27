from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.user.UserAdmin).all()


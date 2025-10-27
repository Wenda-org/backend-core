from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
from app.core.config import settings
from app.database.redis_connection import get_redis_client
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, LoginResponse
from app.models.user import UserAdmin                                    
from app.database.connection import get_db                    
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserAdmin).filter(UserAdmin.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_pw = hash_password(user_data.password)

    new_user = UserAdmin(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=LoginResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserAdmin).filter(UserAdmin.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail={"error": "Credenciais inválidas", "tip": "Verifique email e senha"}
        )

    token = create_access_token({"sub": str(user.id)})

    return LoginResponse(
        response=200,
        access_token=token,
        user=user
    )

@router.post("/logout", status_code=204)
def logout(token: str = Depends(oauth2_scheme), redis=Depends(get_redis_client)):
    try:
        decoded = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        expire_in = decoded["exp"] - int(datetime.utcnow().timestamp())
        redis.setex(f"blacklist:{token}", expire_in, "revoked")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    return

@router.get("/me")
def me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db), redis=Depends(get_redis_client)):
    if redis.exists(f"blacklist:{token}"):
        raise HTTPException(status_code=401, detail="Token revogado")
    
    try:
        decoded = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user = db.query(UserAdmin).get(decoded["sub"])
        return {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "roles": [user.role],
            "preferences": {}
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")



@router.post("/forgot-password")
def forgot_password(email: str):
    # TODO: gerar token e enviar por email
    return {"ok": True}

@router.post("/reset-password")
def reset_password(data: dict):
    # TODO: validar token e atualizar senha
    return {"ok": True}

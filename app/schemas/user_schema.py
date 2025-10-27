from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    role: str
    status: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    response: int
    access_token: str
    user: UserPublic


class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True 

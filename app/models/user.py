from sqlalchemy import Column, String, Enum, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.database.connection import Base
import enum

class UserRole(enum.Enum):
    admin = "admin"
    editor = "editor"
    viewer = "viewer"

class UserAdmin(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.viewer)
    status = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

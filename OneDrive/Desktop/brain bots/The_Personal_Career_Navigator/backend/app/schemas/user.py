# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    github_username: Optional[str] = None
    dream_role: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserProfile(UserBase):
    id: int
    resume_path: Optional[str] = None
    linkedin_data_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
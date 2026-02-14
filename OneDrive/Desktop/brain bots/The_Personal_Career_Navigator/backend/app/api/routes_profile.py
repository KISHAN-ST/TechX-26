# backend/app/api/routes_profile.py
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserProfile
from typing import Optional
import shutil
import os

router = APIRouter(prefix="/profile", tags=["profile"])

@router.post("/create", response_model=UserProfile)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/upload-resume/{user_id}")
def upload_resume(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    upload_dir = "uploads/resumes"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = f"{upload_dir}/{user_id}_{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    user.resume_path = file_path
    db.commit()
    
    return {"message": "Resume uploaded", "path": file_path}

@router.post("/link-github/{user_id}")
def link_github(
    user_id: int,
    github_username: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    user.github_username = github_username
    db.commit()
    
    return {"message": "GitHub linked", "username": github_username}

@router.post("/upload-linkedin/{user_id}")
def upload_linkedin(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    
    upload_dir = "uploads/linkedin"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = f"{upload_dir}/{user_id}_{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    user.linkedin_data_path = file_path
    db.commit()
    
    return {"message": "LinkedIn data uploaded", "path": file_path}

@router.get("/{user_id}", response_model=UserProfile)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return user
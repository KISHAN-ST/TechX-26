# backend/app/models/user.py
from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    github_username = Column(String, nullable=True)
    resume_path = Column(String, nullable=True)
    linkedin_data_path = Column(String, nullable=True)
    dream_role = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    skills = relationship("Skill", back_populates="user")
    roadmaps = relationship("Roadmap", back_populates="user")
    evaluations = relationship("Evaluation", back_populates="user")
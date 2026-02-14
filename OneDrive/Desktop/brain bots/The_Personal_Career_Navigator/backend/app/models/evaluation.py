# backend/app/models/evaluation.py
from sqlalchemy import Column, Float, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Evaluation(Base):
    __tablename__ = "evaluations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    week_number = Column(Integer)
    performance_score = Column(Float)
    skills_updated = Column(JSON)
    adaptations_made = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="evaluations")
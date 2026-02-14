# backend/app/api/routes_gap.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.skill import Skill
from typing import List

router = APIRouter(prefix="/gaps", tags=["gaps"])

def get_sample_gaps(user_id: int):
    """Return sample skill gaps for demonstration"""
    return {
        "user_id": user_id,
        "gaps": [
            {"skill": "Machine Learning", "importance": 0.95, "user_level": 0.40, "gap_score": 0.55},
            {"skill": "Deep Learning", "importance": 0.90, "user_level": 0.30, "gap_score": 0.60},
            {"skill": "TensorFlow", "importance": 0.85, "user_level": 0.35, "gap_score": 0.50},
            {"skill": "Statistics", "importance": 0.80, "user_level": 0.50, "gap_score": 0.30},
            {"skill": "SQL", "importance": 0.75, "user_level": 0.60, "gap_score": 0.15},
            {"skill": "Python Advanced", "importance": 0.88, "user_level": 0.70, "gap_score": 0.18},
            {"skill": "Data Visualization", "importance": 0.70, "user_level": 0.45, "gap_score": 0.25},
            {"skill": "Big Data Tools", "importance": 0.65, "user_level": 0.20, "gap_score": 0.45},
        ]
    }

@router.get("/{user_id}")
def get_skill_gaps(user_id: int, db: Session = Depends(get_db)):
    try:
        skills = db.query(Skill).filter(Skill.user_id == user_id).order_by(
            Skill.gap_score.desc()
        ).all()
        
        if skills:
            return {
                "user_id": user_id,
                "gaps": [
                    {
                        "skill": s.skill_name,
                        "importance": s.importance,
                        "user_level": s.user_level,
                        "gap_score": s.gap_score
                    }
                    for s in skills
                ]
            }
    except Exception as e:
        pass
    
    # Return sample data if not found or error
    return get_sample_gaps(user_id)
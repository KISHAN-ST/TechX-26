# backend/app/schemas/evaluation.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict

class WeeklyEvaluation(BaseModel):
    week_number: int
    performance_score: float
    skills_updated: List[Dict]
    adaptations_made: List[str]

class EvaluationCreate(WeeklyEvaluation):
    pass

class Evaluation(WeeklyEvaluation):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
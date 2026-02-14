# backend/app/schemas/skill.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class SkillBase(BaseModel):
    skill_name: str
    user_level: float = 0.0
    importance: float = 0.0
    gap_score: float = 0.0

class Skill(SkillBase):
    id: int
    user_id: int
    evidence: List[dict] = []
    last_practiced: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class MarketSkill(BaseModel):
    skill: str
    frequency: int
    avg_importance: float

class SkillGap(BaseModel):
    skill: str
    importance: float
    user_level: float
    gap_score: float
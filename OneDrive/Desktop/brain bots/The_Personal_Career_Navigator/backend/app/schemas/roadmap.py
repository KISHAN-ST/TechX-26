# backend/app/schemas/roadmap.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict

class RoadmapDay(BaseModel):
    day: int
    focus_skill: str
    tasks: List[str]
    resources: List[str]
    estimated_hours: float
    difficulty: str

class RoadmapCreate(BaseModel):
    days_data: List[RoadmapDay]

class Roadmap(BaseModel):
    id: int
    user_id: int
    version: int
    days_data: List[Dict]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
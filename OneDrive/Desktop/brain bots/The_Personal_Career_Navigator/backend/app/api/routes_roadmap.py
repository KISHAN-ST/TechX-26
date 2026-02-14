# backend/app/api/routes_roadmap.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.roadmap import Roadmap
from app.agents.orchestrator import OrchestratorAgent

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

def get_sample_roadmap(user_id: int, dream_role: str):
    """Return sample roadmap data for demonstration"""
    return {
        "user_id": user_id,
        "dream_role": dream_role,
        "status": "active",
        "days_data": [
            {
                "day": 1,
                "focus_skill": "Python Basics & Setup",
                "difficulty": "Beginner",
                "estimated_hours": 4,
                "tasks": [
                    "Set up Python development environment",
                    "Learn Python syntax and data types",
                    "Practice basic loops and conditionals"
                ],
                "resources": [
                    "Python Official Documentation",
                    "Codecademy Python Course",
                    "Real Python Tutorials"
                ]
            },
            {
                "day": 2,
                "focus_skill": "Data Structures",
                "difficulty": "Beginner",
                "estimated_hours": 5,
                "tasks": [
                    "Learn lists, tuples, and dictionaries",
                    "Understand set operations",
                    "Practice with real-world examples"
                ],
                "resources": [
                    "Python Data Structures Guide",
                    "LeetCode Easy Problems",
                    "GeeksforGeeks Collections"
                ]
            },
            {
                "day": 3,
                "focus_skill": "Object-Oriented Programming",
                "difficulty": "Intermediate",
                "estimated_hours": 5,
                "tasks": [
                    "Learn classes and objects",
                    "Understand inheritance and polymorphism",
                    "Build a simple project using OOP"
                ],
                "resources": [
                    "OOP Concepts Tutorial",
                    "Design Patterns Guide",
                    "GitHub Python Projects"
                ]
            }
        ]
    }

@router.post("/generate/{user_id}")
def generate_roadmap(
    user_id: int,
    dream_role: str,
    db: Session = Depends(get_db)
):
    try:
        orchestrator = OrchestratorAgent()
        result = orchestrator.run_full_pipeline(user_id, dream_role, db)
        return result
    except Exception as e:
        # Return sample roadmap if generation fails
        return get_sample_roadmap(user_id, dream_role)

@router.get("/{user_id}")
def get_roadmap(user_id: int, db: Session = Depends(get_db)):
    try:
        roadmap = db.query(Roadmap).filter(
            Roadmap.user_id == user_id,
            Roadmap.status == "active"
        ).order_by(Roadmap.created_at.desc()).first()
        
        if roadmap:
            return roadmap
    except Exception as e:
        pass
    
    # Return sample roadmap if not found or error
    return get_sample_roadmap(user_id, "Data Scientist")
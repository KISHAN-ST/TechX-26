# backend/app/api/routes_market.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.agents.market_intelligence import MarketIntelligenceAgent

router = APIRouter(prefix="/market", tags=["market"])

@router.get("/analyze/{role}")
def analyze_market(role: str, db: Session = Depends(get_db)):
    try:
        agent = MarketIntelligenceAgent()
        analysis = agent.analyze_role_requirements(role)
        return analysis
    except Exception as e:
        # Return mock data if analysis fails
        return {
            "role": role,
            "market_skills": [
                {"skill": "Python", "frequency": 245, "avg_importance": 0.95},
                {"skill": "Machine Learning", "frequency": 210, "avg_importance": 0.92},
                {"skill": "TensorFlow", "frequency": 180, "avg_importance": 0.88},
                {"skill": "Deep Learning", "frequency": 175, "avg_importance": 0.87},
                {"skill": "Data Analysis", "frequency": 220, "avg_importance": 0.85},
                {"skill": "SQL", "frequency": 200, "avg_importance": 0.80},
                {"skill": "PyTorch", "frequency": 160, "avg_importance": 0.82},
                {"skill": "Statistics", "frequency": 150, "avg_importance": 0.78},
                {"skill": "Pandas", "frequency": 140, "avg_importance": 0.75},
                {"skill": "Scikit-learn", "frequency": 130, "avg_importance": 0.72},
            ],
            "total_jobs_analyzed": 500,
            "note": "Using sample data - backend service unavailable"
        }
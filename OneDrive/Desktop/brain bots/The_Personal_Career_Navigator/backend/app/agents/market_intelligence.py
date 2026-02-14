# backend/app/agents/market_intelligence.py
from typing import List, Dict
from app.services.kaggle_loader import KaggleLoader
from app.services.embedding_service import EmbeddingService
from collections import Counter

class MarketIntelligenceAgent:
    def __init__(self):
        self.kaggle_loader = KaggleLoader()
        self.embedding_service = EmbeddingService()
    
    def analyze_role_requirements(self, role: str) -> Dict[str, any]:
        job_postings = self.kaggle_loader.load_job_postings(role)
        
        if not job_postings:
            return {
                "role": role,
                "market_skills": [],
                "total_jobs_analyzed": 0
            }
        
        all_skills = []
        job_descriptions = []
        
        for job in job_postings:
            skills_str = job.get("skills_required", "")
            description = job.get("description", "")
            
            job_descriptions.append(description)
            
            skills = [s.strip() for s in skills_str.split(",") if s.strip()]
            all_skills.extend(skills)
        
        skill_counts = Counter(all_skills)
        
        market_skills = []
        for skill, frequency in skill_counts.most_common(50):
            importance = self._calculate_importance(
                skill, frequency, len(job_postings), job_descriptions
            )
            
            market_skills.append({
                "skill": skill,
                "frequency": frequency,
                "avg_importance": importance
            })
        
        market_skills.sort(key=lambda x: x["avg_importance"], reverse=True)
        
        return {
            "role": role,
            "market_skills": market_skills,
            "total_jobs_analyzed": len(job_postings)
        }
    
    def _calculate_importance(
        self, skill: str, frequency: int, total_jobs: int, descriptions: List[str]
    ) -> float:
        frequency_score = frequency / total_jobs
        
        semantic_score = self.embedding_service.compute_skill_importance(
            skill, descriptions[:10]
        )
        
        importance = (frequency_score * 0.6 + semantic_score * 0.4)
        importance = min(importance, 1.0)
        
        return round(importance, 3)
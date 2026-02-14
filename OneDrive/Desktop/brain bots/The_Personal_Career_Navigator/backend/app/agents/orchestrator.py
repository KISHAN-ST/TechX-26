# backend/app/agents/orchestrator.py
from typing import Dict
from sqlalchemy.orm import Session
from app.agents.profile_extraction import ProfileExtractionAgent
from app.agents.market_intelligence import MarketIntelligenceAgent
from app.agents.skill_gap import SkillGapAgent
from app.agents.roadmap_generator import RoadmapGeneratorAgent
from app.agents.evaluation_adaptation import EvaluationAdaptationAgent
from app.models.user import User
from app.models.skill import Skill
from app.models.roadmap import Roadmap
from app.models.evaluation import Evaluation

class OrchestratorAgent:
    def __init__(self):
        self.profile_agent = ProfileExtractionAgent()
        self.market_agent = MarketIntelligenceAgent()
        self.gap_agent = SkillGapAgent()
        self.roadmap_agent = RoadmapGeneratorAgent()
        self.evaluation_agent = EvaluationAdaptationAgent()
    
    def run_full_pipeline(
        self, user_id: int, dream_role: str, db: Session
    ) -> Dict:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"error": "User not found"}
        
        all_extractions = []
        
        if user.resume_path:
            resume_skills = self.profile_agent.extract_from_resume(user.resume_path)
            all_extractions.append(resume_skills)
        
        if user.github_username:
            github_skills = self.profile_agent.extract_from_github(user.github_username)
            all_extractions.append(github_skills)
        
        if user.linkedin_data_path:
            linkedin_skills = self.profile_agent.extract_from_linkedin(user.linkedin_data_path)
            all_extractions.append(linkedin_skills)
        
        user_skills = self.profile_agent.aggregate_skills(all_extractions)
        
        market_analysis = self.market_agent.analyze_role_requirements(dream_role)
        
        gaps = self.gap_agent.compute_gaps(
            user_skills, market_analysis["market_skills"]
        )
        
        for gap in gaps:
            existing = db.query(Skill).filter(
                Skill.user_id == user_id,
                Skill.skill_name == gap.skill
            ).first()
            
            if existing:
                existing.user_level = gap.user_level
                existing.importance = gap.importance
                existing.gap_score = gap.gap_score
            else:
                skill_record = Skill(
                    user_id=user_id,
                    skill_name=gap.skill,
                    user_level=gap.user_level,
                    importance=gap.importance,
                    gap_score=gap.gap_score,
                    evidence=user_skills.get(gap.skill, {}).get("evidence", [])
                )
                db.add(skill_record)
        
        db.commit()
        
        roadmap_days = self.roadmap_agent.generate_roadmap(gaps, days=30)
        
        roadmap_record = Roadmap(
            user_id=user_id,
            version=1,
            days_data=[day.dict() for day in roadmap_days],
            status="active"
        )
        db.add(roadmap_record)
        db.commit()
        
        return {
            "user_id": user_id,
            "profile_extracted": len(user_skills),
            "market_skills_found": len(market_analysis["market_skills"]),
            "gaps_identified": len(gaps),
            "roadmap_generated": True,
            "roadmap_id": roadmap_record.id
        }
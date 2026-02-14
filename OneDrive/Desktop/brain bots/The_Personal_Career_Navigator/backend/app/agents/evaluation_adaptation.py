# backend/app/agents/evaluation_adaptation.py
from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.skill import Skill
from app.models.evaluation import Evaluation
from app.schemas.evaluation import WeeklyEvaluation

class EvaluationAdaptationAgent:
    def evaluate_and_adapt(
        self, user_id: int, week_number: int, db: Session
    ) -> WeeklyEvaluation:
        user_skills = db.query(Skill).filter(Skill.user_id == user_id).all()
        
        performance_score = self._calculate_performance_score(user_skills)
        
        skills_updated = []
        for skill in user_skills:
            old_level = skill.user_level
            
            new_level = old_level + (performance_score * skill.importance * 0.1)
            new_level = min(new_level, 1.0)
            
            new_level = new_level * 0.98
            
            skill.user_level = new_level
            
            new_gap_score = skill.importance * (1 - new_level)
            skill.gap_score = new_gap_score
            
            skills_updated.append({
                "skill": skill.skill_name,
                "old_level": round(old_level, 3),
                "new_level": round(new_level, 3),
                "gap_score": round(new_gap_score, 3)
            })
        
        db.commit()
        
        adaptations = self._determine_adaptations(performance_score)
        
        evaluation = WeeklyEvaluation(
            week_number=week_number,
            performance_score=round(performance_score, 3),
            skills_updated=skills_updated,
            adaptations_made=adaptations
        )
        
        return evaluation
    
    def _calculate_performance_score(self, skills: List[Skill]) -> float:
        if not skills:
            return 0.5
        
        total_improvement = sum([
            skill.user_level * skill.importance for skill in skills
        ])
        
        max_possible = sum([skill.importance for skill in skills])
        
        if max_possible > 0:
            score = total_improvement / max_possible
        else:
            score = 0.5
        
        return min(score, 1.0)
    
    def _determine_adaptations(self, performance_score: float) -> List[str]:
        adaptations = []
        
        if performance_score < 0.5:
            adaptations.append("Reduce roadmap difficulty")
            adaptations.append("Add reinforcement tasks for struggling skills")
            adaptations.append("Increase time allocation per skill")
        elif performance_score >= 0.8:
            adaptations.append("Increase complexity of projects")
            adaptations.append("Add integration projects")
            adaptations.append("Introduce advanced concepts")
        else:
            adaptations.append("Maintain current learning pace")
            adaptations.append("Continue with planned roadmap")
        
        return adaptations
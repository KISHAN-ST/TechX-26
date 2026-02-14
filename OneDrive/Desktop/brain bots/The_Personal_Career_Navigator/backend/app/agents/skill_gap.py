# backend/app/agents/skill_gap.py
from typing import List, Dict
from app.schemas.skill import SkillGap

class SkillGapAgent:
    def compute_gaps(
        self, user_skills: Dict[str, Dict], market_skills: List[Dict]
    ) -> List[SkillGap]:
        gaps = []
        
        for market_skill in market_skills:
            skill_name = market_skill["skill"]
            importance = market_skill["avg_importance"]
            
            user_level = 0.0
            if skill_name in user_skills:
                user_level = user_skills[skill_name].get("user_level", 0.0)
            
            gap_score = importance * (1 - user_level)
            
            gaps.append(SkillGap(
                skill=skill_name,
                importance=importance,
                user_level=user_level,
                gap_score=round(gap_score, 3)
            ))
        
        gaps.sort(key=lambda x: x.gap_score, reverse=True)
        
        return gaps
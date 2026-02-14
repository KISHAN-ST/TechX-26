# backend/app/agents/roadmap_generator.py
from typing import List, Dict
from app.schemas.skill import SkillGap
from app.schemas.roadmap import RoadmapDay

class RoadmapGeneratorAgent:
    def generate_roadmap(self, gaps: List[SkillGap], days: int = 30) -> List[RoadmapDay]:
        top_gaps = gaps[:10]
        
        roadmap = []
        
        days_per_skill = max(days // len(top_gaps), 1) if top_gaps else 1
        
        current_day = 1
        
        for gap in top_gaps:
            skill_days = min(days_per_skill, days - current_day + 1)
            
            if skill_days <= 0:
                break
            
            difficulty = self._determine_difficulty(gap)
            
            for i in range(skill_days):
                day_roadmap = self._generate_day_plan(
                    gap.skill, current_day, i + 1, skill_days, difficulty
                )
                roadmap.append(day_roadmap)
                current_day += 1
                
                if current_day > days:
                    break
            
            if current_day > days:
                break
        
        while current_day <= days:
            roadmap.append(self._generate_review_day(current_day, top_gaps))
            current_day += 1
        
        return roadmap
    
    def _determine_difficulty(self, gap: SkillGap) -> str:
        if gap.user_level < 0.3:
            return "beginner"
        elif gap.user_level < 0.6:
            return "intermediate"
        else:
            return "advanced"
    
    def _generate_day_plan(
        self, skill: str, day: int, day_in_skill: int, total_skill_days: int, difficulty: str
    ) -> RoadmapDay:
        if day_in_skill == 1:
            phase = "introduction"
        elif day_in_skill <= total_skill_days // 2:
            phase = "practice"
        else:
            phase = "project"
        
        tasks = self._generate_tasks(skill, phase, difficulty)
        resources = self._generate_resources(skill, phase, difficulty)
        hours = self._estimate_hours(phase, difficulty)
        
        return RoadmapDay(
            day=day,
            focus_skill=skill,
            tasks=tasks,
            resources=resources,
            estimated_hours=hours,
            difficulty=difficulty
        )
    
    def _generate_tasks(self, skill: str, phase: str, difficulty: str) -> List[str]:
        if phase == "introduction":
            return [
                f"Read foundational documentation for {skill}",
                f"Watch introductory tutorial on {skill}",
                f"Set up development environment for {skill}"
            ]
        elif phase == "practice":
            return [
                f"Complete 3 coding exercises in {skill}",
                f"Build a small demo project using {skill}",
                f"Review and refactor previous {skill} code"
            ]
        else:
            return [
                f"Build a production-ready project with {skill}",
                f"Implement best practices in {skill}",
                f"Document and test {skill} project"
            ]
    
    def _generate_resources(self, skill: str, phase: str, difficulty: str) -> List[str]:
        resources = [
            f"Official {skill} Documentation",
            f"{skill} Tutorial on YouTube",
            f"Practical {skill} Course (Udemy/Coursera)"
        ]
        
        if difficulty == "advanced":
            resources.append(f"Advanced {skill} Patterns Book")
        
        return resources
    
    def _estimate_hours(self, phase: str, difficulty: str) -> float:
        base_hours = {
            "introduction": 2.0,
            "practice": 3.0,
            "project": 4.0
        }
        
        multiplier = {
            "beginner": 1.2,
            "intermediate": 1.0,
            "advanced": 0.8
        }
        
        return base_hours.get(phase, 3.0) * multiplier.get(difficulty, 1.0)
    
    def _generate_review_day(self, day: int, gaps: List[SkillGap]) -> RoadmapDay:
        skills_to_review = [gap.skill for gap in gaps[:3]]
        
        return RoadmapDay(
            day=day,
            focus_skill="Review & Integration",
            tasks=[
                f"Review progress in {', '.join(skills_to_review)}",
                "Build integration project combining multiple skills",
                "Reflect on learning progress"
            ],
            resources=[
                "Personal project repository",
                "Learning journal"
            ],
            estimated_hours=3.0,
            difficulty="mixed"
        )
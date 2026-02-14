# backend/app/services/linkedin_service.py
import json
from typing import List, Dict

class LinkedInService:
    def extract_skills(self, json_path: str) -> List[Dict]:
        skills = []
        
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
            
            if "skills" in data:
                for skill_item in data["skills"]:
                    skill_name = skill_item.get("name", "")
                    endorsements = skill_item.get("endorsements", 0)
                    
                    level = min(endorsements / 20.0, 1.0)
                    
                    skills.append({
                        "skill": skill_name,
                        "source": "linkedin",
                        "evidence": {
                            "endorsements": endorsements,
                            "level": level
                        }
                    })
            
            if "experience" in data:
                for exp in data["experience"]:
                    description = exp.get("description", "")
                    extracted = self._extract_skills_from_text(description)
                    
                    for skill in extracted:
                        skills.append({
                            "skill": skill,
                            "source": "linkedin_experience",
                            "evidence": {
                                "company": exp.get("company", ""),
                                "title": exp.get("title", "")
                            }
                        })
        
        except Exception as e:
            print(f"Error extracting LinkedIn skills: {e}")
        
        return skills
    
    def _extract_skills_from_text(self, text: str) -> List[str]:
        common_skills = [
            "Python", "JavaScript", "Java", "C++", "React", "Node.js",
            "Docker", "Kubernetes", "AWS", "Azure", "SQL", "PostgreSQL",
            "MongoDB", "Machine Learning", "Deep Learning", "NLP",
            "Data Science", "Analytics", "Leadership", "Agile"
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in common_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return found_skills
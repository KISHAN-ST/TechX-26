# backend/app/agents/profile_extraction.py
from typing import List, Dict
import PyPDF2
from app.services.github_service import GitHubService
from app.services.linkedin_service import LinkedInService
import spacy

class ProfileExtractionAgent:
    def __init__(self):
        self.github_service = GitHubService()
        self.linkedin_service = LinkedInService()
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            self.nlp = None
    
    def extract_from_resume(self, pdf_path: str) -> List[Dict]:
        skills = []
        
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
            
            extracted_skills = self._extract_skills_from_text(text)
            
            for skill in extracted_skills:
                skills.append({
                    "skill": skill,
                    "source": "resume",
                    "evidence": {"found_in_resume": True}
                })
        
        except Exception as e:
            print(f"Error extracting resume: {e}")
        
        return skills
    
    def extract_from_github(self, username: str) -> List[Dict]:
        return self.github_service.extract_skills(username)
    
    def extract_from_linkedin(self, json_path: str) -> List[Dict]:
        return self.linkedin_service.extract_skills(json_path)
    
    def _extract_skills_from_text(self, text: str) -> List[str]:
        skills_keywords = [
            "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "Go", "Rust",
            "React", "Angular", "Vue.js", "Node.js", "Django", "Flask", "FastAPI",
            "Docker", "Kubernetes", "Jenkins", "CI/CD", "Git",
            "AWS", "Azure", "GCP", "Cloud",
            "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis",
            "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
            "TensorFlow", "PyTorch", "Scikit-learn",
            "Data Science", "Analytics", "Statistics",
            "Agile", "Scrum", "Leadership", "Project Management"
        ]
        
        found_skills = []
        text_lower = text.lower()
        
        for skill in skills_keywords:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        return list(set(found_skills))
    
    def aggregate_skills(self, all_extractions: List[List[Dict]]) -> Dict[str, Dict]:
        skill_map = {}
        
        for extraction_list in all_extractions:
            for item in extraction_list:
                skill = item["skill"]
                
                if skill not in skill_map:
                    skill_map[skill] = {
                        "skill_name": skill,
                        "sources": [],
                        "evidence": [],
                        "project_count": 0,
                        "recency_weights": []
                    }
                
                skill_map[skill]["sources"].append(item["source"])
                skill_map[skill]["evidence"].append(item.get("evidence", {}))
                skill_map[skill]["project_count"] += 1
                
                if "recency_weight" in item.get("evidence", {}):
                    skill_map[skill]["recency_weights"].append(
                        item["evidence"]["recency_weight"]
                    )
        
        for skill in skill_map:
            data = skill_map[skill]
            
            project_score = min(data["project_count"] / 10.0, 1.0)
            
            recency_score = 0.5
            if data["recency_weights"]:
                recency_score = sum(data["recency_weights"]) / len(data["recency_weights"])
            
            evidence_score = len(data["sources"]) / 3.0
            evidence_score = min(evidence_score, 1.0)
            
            user_level = (project_score * 0.4 + recency_score * 0.3 + evidence_score * 0.3)
            user_level = min(user_level, 1.0)
            
            skill_map[skill]["user_level"] = user_level
        
        return skill_map
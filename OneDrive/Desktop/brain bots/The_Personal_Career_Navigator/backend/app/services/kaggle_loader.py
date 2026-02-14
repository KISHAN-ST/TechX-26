# backend/app/services/kaggle_loader.py
import pandas as pd
from typing import List, Dict
from app.core.config import settings

class KaggleLoader:
    def __init__(self):
        self.dataset_path = settings.KAGGLE_DATASET_PATH
    
    def load_job_postings(self, role: str) -> List[Dict]:
        # TODO: DATASET_PATH - Configure actual Kaggle dataset path
        
        if not self.dataset_path:
            return self._get_mock_data(role)
        
        try:
            df = pd.read_csv(self.dataset_path)
            
            role_lower = role.lower()
            filtered = df[df["title"].str.lower().str.contains(role_lower, na=False)]
            
            jobs = []
            for _, row in filtered.head(100).iterrows():
                jobs.append({
                    "title": row.get("title", ""),
                    "description": row.get("description", ""),
                    "skills_required": row.get("skills", ""),
                    "company": row.get("company", ""),
                    "location": row.get("location", "")
                })
            
            return jobs
        
        except Exception as e:
            print(f"Error loading Kaggle dataset: {e}")
            return self._get_mock_data(role)
    
    def _get_mock_data(self, role: str) -> List[Dict]:
        # MOCK_DATA
        mock_jobs = {
            "machine learning engineer": [
                {
                    "title": "Machine Learning Engineer",
                    "skills_required": "Python, TensorFlow, PyTorch, MLOps, Docker, Kubernetes, AWS, SQL",
                    "company": "MOCK_COMPANY_A",
                    "description": "MOCK_DATA: Build and deploy ML models"
                },
                {
                    "title": "Senior ML Engineer",
                    "skills_required": "Python, Deep Learning, NLP, Computer Vision, MLOps, Spark",
                    "company": "MOCK_COMPANY_B",
                    "description": "MOCK_DATA: Lead ML initiatives"
                }
            ],
            "data scientist": [
                {
                    "title": "Data Scientist",
                    "skills_required": "Python, R, SQL, Statistics, Machine Learning, Pandas, Scikit-learn",
                    "company": "MOCK_COMPANY_C",
                    "description": "MOCK_DATA: Analyze data and build models"
                }
            ]
        }
        
        role_lower = role.lower()
        for key in mock_jobs:
            if key in role_lower:
                return mock_jobs[key]
        
        return []
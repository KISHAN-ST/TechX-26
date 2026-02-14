# backend/app/services/github_service.py
import requests
from typing import List, Dict
from datetime import datetime, timedelta
from app.core.config import settings

class GitHubService:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json"
        }
    
    def extract_skills(self, username: str) -> List[Dict]:
        skills = []
        
        repos = self._get_user_repos(username)
        
        language_counts = {}
        tech_stack = set()
        
        for repo in repos:
            if repo.get("language"):
                lang = repo["language"]
                language_counts[lang] = language_counts.get(lang, 0) + 1
            
            languages = self._get_repo_languages(username, repo["name"])
            tech_stack.update(languages.keys())
            
            updated_at = datetime.strptime(repo["updated_at"], "%Y-%m-%dT%H:%M:%SZ")
            recency_weight = self._calculate_recency_weight(updated_at)
            
            for lang in languages.keys():
                skills.append({
                    "skill": lang,
                    "source": "github",
                    "evidence": {
                        "repo": repo["name"],
                        "stars": repo["stargazers_count"],
                        "updated_at": repo["updated_at"],
                        "recency_weight": recency_weight
                    }
                })
        
        return skills
    
    def _get_user_repos(self, username: str) -> List[Dict]:
        url = f"{self.base_url}/users/{username}/repos"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return []
    
    def _get_repo_languages(self, username: str, repo_name: str) -> Dict:
        url = f"{self.base_url}/repos/{username}/{repo_name}/languages"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return {}
    
    def _calculate_recency_weight(self, updated_at: datetime) -> float:
        now = datetime.utcnow()
        days_ago = (now - updated_at).days
        
        if days_ago <= 30:
            return 1.0
        elif days_ago <= 90:
            return 0.8
        elif days_ago <= 180:
            return 0.5
        elif days_ago <= 365:
            return 0.3
        else:
            return 0.1
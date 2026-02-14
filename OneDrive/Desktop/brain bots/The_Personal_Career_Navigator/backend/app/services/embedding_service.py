# backend/app/services/embedding_service.py
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
    
    def compute_similarity(self, text1: str, text2: str) -> float:
        embeddings = self.model.encode([text1, text2])
        similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        return float(similarity)
    
    def compute_skill_importance(self, skill: str, job_descriptions: List[str]) -> float:
        skill_embedding = self.model.encode([skill])
        
        similarities = []
        for desc in job_descriptions:
            desc_embedding = self.model.encode([desc])
            sim = cosine_similarity(skill_embedding, desc_embedding)[0][0]
            similarities.append(sim)
        
        if similarities:
            return float(np.mean(similarities))
        return 0.0
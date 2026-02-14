# backend/README.md

# Personal Career Navigator - Backend

Production-ready multi-agent AI system for career development.

## Architecture

Multi-agent system with specialized agents:
- ProfileExtractionAgent: Extract skills from resume, GitHub, LinkedIn
- MarketIntelligenceAgent: Analyze job market requirements
- SkillGapAgent: Compute weighted skill gaps
- RoadmapGeneratorAgent: Generate 30-day learning roadmap
- EvaluationAdaptationAgent: Weekly evaluation and adaptation
- OrchestratorAgent: Coordinate all agents

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Setup database:
```bash
# PostgreSQL must be running
# Database tables are auto-created on startup
```

4. Run application:
```bash
uvicorn app.main:app --reload
```

5. Run Celery worker (for scheduled tasks):
```bash
celery -A app.tasks.celery_app worker --loglevel=info
celery -A app.tasks.celery_app beat --loglevel=info
```

## API Endpoints

### Profile
- POST /profile/create
- POST /profile/upload-resume/{user_id}
- POST /profile/link-github/{user_id}
- POST /profile/upload-linkedin/{user_id}
- GET /profile/{user_id}

### Market
- GET /market/analyze/{role}

### Gaps
- GET /gaps/{user_id}

### Roadmap
- POST /roadmap/generate/{user_id}
- GET /roadmap/{user_id}

### Evaluation
- POST /evaluation/run/{user_id}
- GET /evaluation/{user_id}

## Data Sources

- HuggingFace Skills Extraction (NER tagging via spaCy)
- Kaggle LinkedIn Job Postings Dataset (configure path in .env)
- GitHub REST API (requires token)

## Skill Gap Formula
```
gap_score = importance * (1 - user_level)
```

User level calculation:
```
user_level = (project_score * 0.4 + recency_score * 0.3 + evidence_score * 0.3)
```

## Adaptation Logic

Weekly evaluation updates:
```
new_level = old_level + (performance_score * importance * 0.1)
skill_level = skill_level * 0.98  # decay
```

Adaptations:
- performance_score < 0.5: Reduce difficulty, add reinforcement
- performance_score >= 0.8: Increase complexity, add integration projects

## Docker
```bash
docker build -t career-navigator-backend .
docker run -p 8000:8000 career-navigator-backend
```
# backend/app/tasks/celery_app.py
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "career_navigator",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.task_routes = {
    "app.tasks.scheduled_tasks.*": {"queue": "scheduled"}
}

celery_app.conf.beat_schedule = {
    "weekly-evaluation": {
        "task": "app.tasks.scheduled_tasks.run_weekly_evaluation",
        "schedule": 604800.0,
    }
}
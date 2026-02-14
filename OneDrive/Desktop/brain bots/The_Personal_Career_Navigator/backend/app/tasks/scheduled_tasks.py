# backend/app/tasks/scheduled_tasks.py
from app.tasks.celery_app import celery_app
from app.db.session import SessionLocal
from app.agents.evaluation_adaptation import EvaluationAdaptationAgent
from app.models.user import User
from app.models.evaluation import Evaluation

@celery_app.task
def run_weekly_evaluation():
    db = SessionLocal()
    
    try:
        users = db.query(User).all()
        
        for user in users:
            latest_eval = db.query(Evaluation).filter(
                Evaluation.user_id == user.id
            ).order_by(Evaluation.created_at.desc()).first()
            
            week_number = 1
            if latest_eval:
                week_number = latest_eval.week_number + 1
            
            agent = EvaluationAdaptationAgent()
            evaluation = agent.evaluate_and_adapt(user.id, week_number, db)
            
            eval_record = Evaluation(
                user_id=user.id,
                week_number=week_number,
                performance_score=evaluation.performance_score,
                skills_updated=evaluation.skills_updated,
                adaptations_made=evaluation.adaptations_made
            )
            db.add(eval_record)
        
        db.commit()
    
    finally:
        db.close()
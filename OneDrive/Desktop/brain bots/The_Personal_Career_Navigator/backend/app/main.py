# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base
from app.db.session import engine
from app.api import routes_profile, routes_market, routes_gap, routes_roadmap, routes_evaluation

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Career Navigator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_profile.router)
app.include_router(routes_market.router)
app.include_router(routes_gap.router)
app.include_router(routes_roadmap.router)
app.include_router(routes_evaluation.router)

@app.get("/")
def root():
    return {"message": "Personal Career Navigator API"}

@app.get("/health")
def health():
    return {"status": "healthy"}
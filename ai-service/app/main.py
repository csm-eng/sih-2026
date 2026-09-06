"""
SmartHire Hub - AI/ML API (MVP)
--------------------------------
Run with:  PYTHONPATH=. uvicorn app.main:app --reload --port 8000
Docs at:   http://localhost:8000/docs

Endpoints:
  POST /extract-skills      -> raw text in, skill list + proficiency out
  POST /normalize-skill     -> messy skill string in, canonical skill out
  POST /skill-gap           -> student + target skills in, gap list out
  POST /rank-opportunities  -> student skills + internship/job list in, ranked out
"""

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List

from app.extraction import extract_skills, estimate_proficiency
from app.normalization import normalize_skill
from app.matching import match_score, skill_gap, rank_opportunities

app = FastAPI(title="SmartHire Hub AI/ML API")


class TextIn(BaseModel):
    text: str


class SkillTermIn(BaseModel):
    term: str


class SkillGapIn(BaseModel):
    student_skills: Dict[str, int]   # {"python": 80, "react": 60}
    target_skills: Dict[str, int]    # {"python": 90, "sql": 70}


class Opportunity(BaseModel):
    id: int
    title: str
    required_skills: Dict[str, int]


class RankIn(BaseModel):
    student_skills: Dict[str, int]
    opportunities: List[Opportunity]


@app.post("/extract-skills")
def api_extract_skills(payload: TextIn):
    results = extract_skills(payload.text)
    for r in results:
        r["proficiency"] = estimate_proficiency(r["context"])
    return {"skills_found": results}


@app.post("/normalize-skill")
def api_normalize_skill(payload: SkillTermIn):
    canonical, score = normalize_skill(payload.term)
    return {"input": payload.term, "canonical_skill": canonical, "confidence": score}


@app.post("/skill-gap")
def api_skill_gap(payload: SkillGapIn):
    score = match_score(payload.student_skills, payload.target_skills)
    gaps = skill_gap(payload.student_skills, payload.target_skills)
    return {"match_score": score, "gaps": gaps}


@app.post("/rank-opportunities")
def api_rank_opportunities(payload: RankIn):
    opps = [o.dict() for o in payload.opportunities]
    ranked = rank_opportunities(payload.student_skills, opps)
    return {"ranked": ranked}


@app.get("/")
def root():
    return {"status": "SmartHire Hub AI/ML API running"}

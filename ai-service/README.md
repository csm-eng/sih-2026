# SmartHire Hub — AI/ML MVP

Run:
```
pip install -r requirements.txt
PYTHONPATH=. uvicorn app.main:app --reload --port 8000
```

Then open http://localhost:8000/docs for interactive Swagger UI to demo
all endpoints to judges.

## Pipeline (matches the pitch deck)
Resume text -> extraction.py (skill extraction + proficiency)
            -> normalization.py (canonicalize skill names)
            -> matching.py (gap analysis + internship/job ranking)
            -> main.py (FastAPI endpoints tying it together)

## Files
- `data/skill_taxonomy.py` — curated skill list + category + short aliases
- `app/extraction.py` — pull skills + proficiency out of resume/cert text
- `app/normalization.py` — fuzzy-match messy skill strings to canonical form
- `app/matching.py` — cosine-similarity engine (gap analysis + ranking)
- `app/main.py` — FastAPI wrapper exposing it all as an API

## Endpoints
- `POST /extract-skills` — raw text in, skill list + proficiency out
- `POST /normalize-skill` — messy skill string in, canonical skill out
- `POST /skill-gap` — student + target skills in, gap list out
- `POST /rank-opportunities` — student skills + internship/job list in, ranked out

## Next steps to extend
- Swap `extraction.py`'s dictionary match for an LLM-prompted extractor for
  messier real-world resumes.
- Swap `normalization.py` to sentence-transformers embeddings once you have
  reliable internet (handles semantic, not just spelling, variants) — the
  function signature (`normalize_skill(raw_skill)`) stays the same.
- Expand `data/skill_taxonomy.py` with a real taxonomy (ESCO has ~13k skills,
  free to download).
- Wire `matching.py`'s `rank_opportunities()` into a real internship/job DB
  instead of the hardcoded list in the `__main__` block.

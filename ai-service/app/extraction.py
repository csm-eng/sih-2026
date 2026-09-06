"""
Skill Extraction
-----------------
MVP approach: dictionary/keyword matching against the skill taxonomy,
using word-boundary regex so "c" doesn't match inside "vector".

This is fast, has zero training cost, and is fully explainable to judges
("we matched against a curated skill taxonomy") - a good MVP trade-off
vs. training a custom NER model under hackathon time pressure.

Swap-in upgrade path (mention this in your pitch):
  - spaCy PhraseMatcher for better multi-word handling
  - LLM-based extraction (prompt Claude/GPT to pull skills + confidence)
    for messier / unstructured resume text
"""

import re
from data.skill_taxonomy import get_all_skills, get_category


def extract_skills(text: str):
    """
    Returns a list of dicts: [{"skill": "python", "category": "...", "context": "..."}]

    Longer taxonomy entries are matched first (e.g. "embedded c" before "c")
    and any span already covered by a longer match is skipped, so "c" doesn't
    also fire separately inside "embedded c".
    """
    text_lower = text.lower()
    found = []
    covered_spans = []  # list of (start, end) already claimed by a longer match

    # match longest skills first so multi-word skills win over their substrings
    for skill in sorted(get_all_skills(), key=len, reverse=True):
        pattern = r"(?<![a-z0-9])" + re.escape(skill) + r"(?![a-z0-9])"
        match = re.search(pattern, text_lower)
        if not match:
            continue

        span = (match.start(), match.end())
        if any(span[0] >= c[0] and span[1] <= c[1] for c in covered_spans):
            continue  # already covered by a longer skill match

        covered_spans.append(span)
        start = max(0, match.start() - 30)
        end = min(len(text_lower), match.end() + 30)
        found.append({
            "skill": skill,
            "category": get_category(skill),
            "context": text[start:end].strip(),
            "_span": span,
        })

    # restore original taxonomy order for readability, drop internal field
    for f in found:
        f.pop("_span")
    return found


def estimate_proficiency(context: str) -> int:
    """
    Very simple heuristic proficiency scorer (0-100) based on keywords in the
    LOCAL CONTEXT around the skill mention (not the whole document) - so
    "expert in Python, basic knowledge of SQL" scores them differently.
    Placeholder for a real model - e.g. based on years of experience mentioned,
    project count, certification level, etc.
    """
    context_lower = context.lower()
    score = 40  # baseline: skill is mentioned at all

    boosters = {
        "expert": 40, "advanced": 30, "proficient": 25,
        "intermediate": 15, "beginner": -10, "basic": -10,
        "certified": 20, "years of experience": 20, "led": 15, "built": 10,
    }
    for word, boost in boosters.items():
        # word-boundary check so "led" doesn't match inside "knowledge"
        if re.search(r"(?<![a-z])" + re.escape(word) + r"(?![a-z])", context_lower):
            score += boost

    return max(0, min(100, score))


if __name__ == "__main__":
    sample_resume = """
    Sandhiya is a proficient Python developer with experience in React.js
    and Node.js. Certified in Machine Learning. Built several FastAPI backends.
    Familiar with PostgreSQL and basic Embedded C for IoT projects.
    """
    results = extract_skills(sample_resume)
    for r in results:
        r["proficiency"] = estimate_proficiency(r["context"])
        print(r)

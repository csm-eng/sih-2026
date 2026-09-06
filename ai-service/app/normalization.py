"""
Skill Normalization
--------------------
Maps variant skill strings ("ReactJS", "React JS", "react.js") to a single
canonical taxonomy entry, so the graph/matching layer doesn't fragment the
same skill into multiple nodes.

MVP approach: rapidfuzz string similarity against the taxonomy. This has
NO internet/model-download dependency - important for a hackathon demo
where venue wifi or judges' laptops might not have HF Hub access.

Upgrade path (mention in pitch): swap to sentence-transformers embeddings
(all-MiniLM-L6-v2) for semantic matches beyond spelling variants - e.g.
matching "js frontend framework" to "react" - once you have reliable
internet at demo time. The function signature below stays the same either
way, so swapping the implementation later doesn't touch calling code.
"""

from rapidfuzz import process, fuzz
from data.skill_taxonomy import get_all_skills, SKILL_ALIASES

_TAXONOMY = get_all_skills()


def normalize_skill(raw_skill: str, threshold: float = 60.0):
    """
    Returns (canonical_skill, similarity_score_0_to_100) or (None, score)
    if nothing clears the threshold.

    Checks the exact alias table first (handles short abbreviations like
    "ML", "JS" that fuzzy matching scores unreliably), then falls back to
    fuzzy string matching for spelling variants of longer terms.
    """
    raw_skill_clean = raw_skill.lower().strip()

    if raw_skill_clean in SKILL_ALIASES:
        return SKILL_ALIASES[raw_skill_clean], 100.0

    match = process.extractOne(
        raw_skill_clean, _TAXONOMY, scorer=fuzz.WRatio
    )
    if match is None:
        return None, 0.0

    canonical, score, _ = match
    if score >= threshold:
        return canonical, score
    return None, score


if __name__ == "__main__":
    test_terms = [
        "ReactJS", "React JS", "react.js", "Python programming",
        "ML", "css3", "node js", "Embedded-C", "postgres", "javascriptt",
    ]
    for term in test_terms:
        canonical, score = normalize_skill(term)
        print(f"{term!r:22} -> {canonical!r:20} (score={score:.1f})")

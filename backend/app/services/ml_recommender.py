import random
from typing import List, Dict
import numpy as np

def add_exploration_diversity(
    recommendations: List[Dict],
    exploration_rate: float = 0.15
) -> List[Dict]:
    """
    Add exploration vs exploitation balance
    85% top matches, 15% diverse picks for discovery
    """
    if len(recommendations) < 5:
        return recommendations
    
    num_exploit = int(len(recommendations) * (1 - exploration_rate))
    num_explore = len(recommendations) - num_exploit
    
    # Top recommendations (exploitation)
    top_picks = recommendations[:num_exploit]
    
    # Random diverse picks (exploration)
    remaining = recommendations[num_exploit:]
    if len(remaining) > num_explore:
        explore_picks = random.sample(remaining, num_explore)
    else:
        explore_picks = remaining
    
    # Interleave for better UX
    result = top_picks + explore_picks
    random.shuffle(result[num_exploit//2:])  # Shuffle latter half
    
    return result

def apply_collaborative_signal(
    content_score: float,
    popularity: float,
    blend_weight: float = 0.15
) -> float:
    """
    Blend content-based score with popularity (collaborative signal proxy)
    """
    cf_score = min(popularity / 100, 1.0)
    return (1 - blend_weight) * content_score + blend_weight * cf_score

def boost_trending_movies(
    movie_data: dict,
    base_score: float,
    trending_boost: float = 0.05
) -> float:
    """
    Slight boost for recently popular movies
    """
    popularity = movie_data.get("popularity", 0)
    if popularity > 80:  # High popularity threshold
        return min(base_score + trending_boost, 1.0)
    return base_score

def diversity_filter(
    recommendations: List[Dict],
    genre_diversity_threshold: int = 3
) -> List[Dict]:
    """
    Ensure genre diversity in recommendations
    """
    seen_genres = set()
    diverse_recs = []
    
    for rec in recommendations:
        movie_genres = set(rec.get("details", {}).get("genres", []))
        
        # Allow if introduces new genres or we don't have many yet
        if len(movie_genres - seen_genres) > 0 or len(diverse_recs) < genre_diversity_threshold:
            diverse_recs.append(rec)
            seen_genres.update(movie_genres)
    
    return diverse_recs

def calculate_confidence_score(
    genre_similarity: float,
    actor_similarity: float,
    content_similarity: float
) -> float:
    """
    Calculate confidence in recommendation
    Higher when multiple signals agree
    """
    scores = [genre_similarity, actor_similarity, content_similarity]
    return float(np.mean(scores) * (1 + np.std(scores)))

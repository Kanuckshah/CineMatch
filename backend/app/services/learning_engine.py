from typing import Dict

def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp value between min and max"""
    return max(min_val, min(max_val, value))

def update_weights_from_feedback(
    user_profile: dict,
    movie_data: dict,
    action: str
) -> dict:
    """Update user preference weights based on feedback"""
    
    genre_weights = user_profile.get("genre_weights", {}).copy()
    actor_weights = user_profile.get("actor_weights", {}).copy()
    
    movie_genres = [g["name"] for g in movie_data.get("genres", [])]
    credits = movie_data.get("credits", {})
    movie_actors = [a["name"] for a in credits.get("cast", [])[:3]]
    
    if action == "like":
        # Increase weights for genres
        for genre in movie_genres:
            current = genre_weights.get(genre, 1.0)
            genre_weights[genre] = clamp(current + 0.05, 0.1, 2.0)
        
        # Increase weights for actors
        for actor in movie_actors:
            current = actor_weights.get(actor, 1.0)
            actor_weights[actor] = clamp(current + 0.04, 0.1, 2.0)
    
    elif action == "dislike":
        # Decrease weights for genres
        for genre in movie_genres:
            current = genre_weights.get(genre, 1.0)
            genre_weights[genre] = clamp(current - 0.03, 0.1, 2.0)
        
        # Slightly decrease actor weights
        for actor in movie_actors:
            current = actor_weights.get(actor, 1.0)
            actor_weights[actor] = clamp(current - 0.02, 0.1, 2.0)
    
    return {
        "genre_weights": genre_weights,
        "actor_weights": actor_weights
    }

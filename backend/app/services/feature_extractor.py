from typing import List, Dict
from app.services.tmdb_client import tmdb_client
from app.models.user_profile import MovieReference

async def build_user_profile(
    favorite_movies: List[MovieReference],
    selected_genres: List[str],
    selected_actors: List[str]
) -> Dict:
    """Build initial user profile with feature extraction"""
    
    genre_weights = {}
    actor_weights = {}
    
    # Extract features from favorite movies
    for movie_ref in favorite_movies:
        try:
            movie_details = tmdb_client.get_movie_details(movie_ref.id)
            
            # Weight genres from favorites
            for genre in movie_details.get("genres", []):
                genre_name = genre["name"]
                genre_weights[genre_name] = genre_weights.get(genre_name, 0) + 0.2
            
            # Weight actors from favorites
            credits = movie_details.get("credits", {})
            cast = credits.get("cast", [])[:5]  # Top 5 actors
            for actor in cast:
                actor_name = actor["name"]
                actor_weights[actor_name] = actor_weights.get(actor_name, 0) + 0.15
                
        except Exception as e:
            print(f"Error extracting features for movie {movie_ref.id}: {e}")
    
    # Boost selected genres
    for genre in selected_genres:
        genre_weights[genre] = genre_weights.get(genre, 0) + 0.5
    
    # Boost selected actors
    for actor in selected_actors:
        actor_weights[actor] = actor_weights.get(actor, 0) + 0.3
    
    # Normalize weights to reasonable range
    for genre in genre_weights:
        genre_weights[genre] = min(genre_weights[genre] + 1.0, 2.0)
    
    for actor in actor_weights:
        actor_weights[actor] = min(actor_weights[actor] + 1.0, 2.0)
    
    return {
        "genre_weights": genre_weights,
        "actor_weights": actor_weights,
    }

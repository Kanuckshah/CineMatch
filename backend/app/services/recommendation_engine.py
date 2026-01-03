import numpy as np
from typing import List, Dict
from datetime import datetime
from app.services.tmdb_client import tmdb_client
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer

def calculate_genre_similarity(user_genre_weights: Dict[str, float], movie_genres: List[str]) -> float:
    """Calculate similarity based on genre preferences"""
    score = sum(user_genre_weights.get(g, 0) for g in movie_genres)
    return min(score / 2.0, 1.0)  # Normalize

def calculate_actor_similarity(user_actor_weights: Dict[str, float], movie_actors: List[str]) -> float:
    """Calculate similarity based on actor preferences"""
    if not user_actor_weights:
        return 0.0
    score = sum(user_actor_weights.get(a, 0) for a in movie_actors)
    return min(score / 1.5, 1.0)  # Normalize

def create_movie_vector(movie_data: dict) -> List[str]:
    """Create feature list for a movie"""
    features = []
    
    # Add genres
    for genre in movie_data.get("genres", []):
        features.append(f"genre_{genre['name']}")
    
    # Add top actors
    credits = movie_data.get("credits", {})
    cast = credits.get("cast", [])[:5]
    for actor in cast:
        features.append(f"actor_{actor['name']}")
    
    # Add director
    crew = credits.get("crew", [])
    for person in crew:
        if person.get("job") == "Director":
            features.append(f"director_{person['name']}")
            break
    
    # Add keywords
    for keyword in movie_data.get("keywords", {}).get("keywords", [])[:10]:
        features.append(f"keyword_{keyword['name']}")
    
    return features

def calculate_content_similarity(favorite_movie_ids: List[int], candidate_movie_data: dict) -> float:
    """Calculate cosine similarity between candidate and favorite movies"""
    try:
        # Get candidate features
        candidate_features = create_movie_vector(candidate_movie_data)
        
        # Get favorite movie features
        favorite_features_list = []
        for movie_id in favorite_movie_ids:
            try:
                movie_details = tmdb_client.get_movie_details(movie_id)
                features = create_movie_vector(movie_details)
                favorite_features_list.append(features)
            except:
                continue
        
        if not favorite_features_list:
            return 0.0
        
        # Convert to binary vectors using MultiLabelBinarizer
        mlb = MultiLabelBinarizer()
        all_features = favorite_features_list + [candidate_features]
        vectors = mlb.fit_transform(all_features)
        
        # Calculate cosine similarity
        candidate_vector = vectors[-1].reshape(1, -1)
        favorite_vectors = vectors[:-1]
        
        similarities = cosine_similarity(candidate_vector, favorite_vectors)[0]
        return float(np.mean(similarities))
        
    except Exception as e:
        print(f"Error calculating content similarity: {e}")
        return 0.0

def calculate_rating_score(vote_average: float) -> float:
    """Normalize rating score"""
    return vote_average / 10.0

def calculate_recency_score(release_date: str) -> float:
    """Calculate recency bias"""
    try:
        release_year = int(release_date[:4]) if release_date else 2000
        current_year = datetime.now().year
        return max(0, 1 - (current_year - release_year) / 30)
    except:
        return 0.5

def calculate_final_score(
    user_profile: dict,
    movie_data: dict,
    favorite_movie_ids: List[int]
) -> float:
    """Calculate final hybrid score for a movie"""
    
    # Extract movie features
    movie_genres = [g["name"] for g in movie_data.get("genres", [])]
    credits = movie_data.get("credits", {})
    movie_actors = [a["name"] for a in credits.get("cast", [])[:5]]
    
    # Calculate component scores
    genre_sim = calculate_genre_similarity(user_profile.get("genre_weights", {}), movie_genres)
    actor_sim = calculate_actor_similarity(user_profile.get("actor_weights", {}), movie_actors)
    content_sim = calculate_content_similarity(favorite_movie_ids, movie_data)
    rating_score = calculate_rating_score(movie_data.get("vote_average", 0))
    recency_score = calculate_recency_score(movie_data.get("release_date", ""))
    
    # Weighted combination
    final_score = (
        genre_sim * 0.35 +
        actor_sim * 0.20 +
        content_sim * 0.25 +
        rating_score * 0.10 +
        recency_score * 0.10
    )
    
    return final_score

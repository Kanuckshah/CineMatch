from fastapi import APIRouter, HTTPException, Query
from app.services.recommendation_engine import calculate_final_score
from app.services.tmdb_client import tmdb_client
from app.services.ml_recommender import (
    add_exploration_diversity,
    apply_collaborative_signal,
    diversity_filter
)
from typing import List
import firebase_admin
from firebase_admin import firestore

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

db = firestore.client() if firebase_admin._apps else None

@router.get("/{uid}")
async def get_recommendations(
    uid: str,
    limit: int = Query(20, ge=1, le=50),
    page: int = Query(1, ge=1)
):
    """Get personalized movie recommendations for a user"""
    if not db:
        raise HTTPException(status_code=503, detail="Firestore not initialized")
    
    # Get user profile
    profile_doc = db.collection("user_profiles").document(uid).get()
    if not profile_doc.exists:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    user_profile = profile_doc.to_dict()
    favorite_movie_ids = [m["id"] for m in user_profile.get("favorite_movies", [])]
    
    # Get candidate movies
    popular_movies = tmdb_client.get_popular_movies(page=page, min_rating=6.0)
    
    # Score each movie
    scored_movies = []
    for movie in popular_movies:
        # Skip if already in favorites
        if movie["id"] in favorite_movie_ids:
            continue
        
        try:
            # Get full details for scoring
            movie_details = tmdb_client.get_movie_details(movie["id"])
            base_score = calculate_final_score(user_profile, movie_details, favorite_movie_ids)
            
            # Apply collaborative signal
            final_score = apply_collaborative_signal(
                base_score,
                movie.get("popularity", 0)
            )
            
            scored_movies.append({
                "movie": movie,
                "score": final_score,
                "details": {
                    "genres": [g["name"] for g in movie_details.get("genres", [])],
                    "actors": [a["name"] for a in movie_details.get("credits", {}).get("cast", [])[:3]],
                }
            })
        except Exception as e:
            print(f"Error scoring movie {movie['id']}: {e}")
            continue
    
    # Sort by score
    scored_movies.sort(key=lambda x: x["score"], reverse=True)
    
    # Apply diversity filter
    diverse_recs = diversity_filter(scored_movies)
    
    # Apply exploration/exploitation
    final_recs = add_exploration_diversity(diverse_recs)
    
    # Limit results
    top_recommendations = final_recs[:limit]
    
    return {
        "recommendations": top_recommendations,
        "total": len(top_recommendations),
        "page": page
    }

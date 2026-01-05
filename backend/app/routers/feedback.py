from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.learning_engine import update_weights_from_feedback
from app.services.tmdb_client import tmdb_client
import firebase_admin
from firebase_admin import firestore

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

db = firestore.client() if firebase_admin._apps else None

class FeedbackRequest(BaseModel):
    uid: str
    movie_id: int
    action: str  # "like" or "dislike"

@router.post("/")
async def record_feedback(request: FeedbackRequest):
    """Record user feedback and update weights"""
    if not db:
        raise HTTPException(status_code=503, detail="Firestore not initialized")
    
    # Get user profile
    profile_ref = db.collection("user_profiles").document(request.uid)
    profile_doc = profile_ref.get()
    
    if not profile_doc.exists:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    user_profile = profile_doc.to_dict()
    
    try:
        # Get movie details
        movie_data = tmdb_client.get_movie_details(request.movie_id)
        
        # Update weights
        updated_weights = update_weights_from_feedback(
            user_profile,
            movie_data,
            request.action
        )
        
        # Save to Firestore
        profile_ref.update({
            "genre_weights": updated_weights["genre_weights"],
            "actor_weights": updated_weights["actor_weights"],
            "updated_at": firestore.SERVER_TIMESTAMP
        })
        
        # Store interaction history
        db.collection("interactions").add({
            "uid": request.uid,
            "movie_id": request.movie_id,
            "action": request.action,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        return {
            "message": "Feedback recorded",
            "updated_weights": updated_weights
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

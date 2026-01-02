from fastapi import APIRouter, HTTPException
from app.models.user_profile import ProfileCreateRequest, UserProfile
from app.services.feature_extractor import build_user_profile
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import os

router = APIRouter(prefix="/api/users", tags=["users"])

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "./serviceAccountKey.json")
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

db = firestore.client() if firebase_admin._apps else None

@router.post("/profile")
async def create_user_profile(request: ProfileCreateRequest):
    """Create user profile from onboarding data"""
    try:
        # Build profile with initial weights
        profile = await build_user_profile(
            request.favorite_movies,
            request.preferred_genres,
            request.preferred_actors
        )
        
        # Add user metadata
        profile_data = {
            "uid": request.uid,
            "email": request.email,
            "favorite_movies": [m.dict() for m in request.favorite_movies],
            "preferred_genres": request.preferred_genres,
            "preferred_actors": request.preferred_actors,
            "genre_weights": profile["genre_weights"],
            "actor_weights": profile["actor_weights"],
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP,
        }
        
        # Store in Firestore
        if db:
            db.collection("user_profiles").document(request.uid).set(profile_data)
        
        return {"message": "Profile created successfully", "profile": profile_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{uid}/profile")
async def get_user_profile(uid: str):
    """Get user profile by UID"""
    if not db:
        raise HTTPException(status_code=503, detail="Firestore not initialized")
    
    doc = db.collection("user_profiles").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return doc.to_dict()

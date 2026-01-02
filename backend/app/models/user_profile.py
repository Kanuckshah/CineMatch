from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class MovieReference(BaseModel):
    id: int
    title: str

class UserProfile(BaseModel):
    uid: str
    email: str
    favorite_movies: List[MovieReference]
    preferred_genres: List[str]
    preferred_actors: List[str] = []
    genre_weights: Dict[str, float] = {}
    actor_weights: Dict[str, float] = {}
    created_at: datetime = None
    updated_at: datetime = None

class ProfileCreateRequest(BaseModel):
    uid: str
    email: str
    favorite_movies: List[MovieReference]
    preferred_genres: List[str]
    preferred_actors: List[str] = []

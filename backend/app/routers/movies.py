from fastapi import APIRouter, Query
from app.services.tmdb_client import tmdb_client

router = APIRouter(prefix="/api/movies", tags=["movies"])

@router.get("/popular")
async def get_popular_movies(page: int = Query(1, ge=1), min_rating: float = Query(6.5, ge=0, le=10)):
    """Get popular movies with optional filters"""
    movies = tmdb_client.get_popular_movies(page=page, min_rating=min_rating)
    return {"movies": movies, "page": page}

@router.get("/search")
async def search_movies(q: str = Query(..., min_length=1), page: int = Query(1, ge=1)):
    """Search for movies by title"""
    movies = tmdb_client.search_movies(query=q, page=page)
    return {"movies": movies, "query": q, "page": page}

@router.get("/{movie_id}")
async def get_movie_details(movie_id: int):
    """Get detailed information about a specific movie"""
    movie = tmdb_client.get_movie_details(movie_id)
    return movie

@router.get("/genres/list")
async def get_genres():
    """Get all available movie genres"""
    genres = tmdb_client.get_genres()
    return {"genres": genres}

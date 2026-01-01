import os
import requests
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class TMDBClient:
    def __init__(self):
        self.api_key = os.getenv("TMDB_API_KEY")
        self.base_url = "https://api.themoviedb.org/3"
        
    def _make_request(self, endpoint: str, params: dict = None) -> dict:
        """Make authenticated request to TMDB API"""
        if params is None:
            params = {}
        params["api_key"] = self.api_key
        
        response = requests.get(f"{self.base_url}/{endpoint}", params=params)
        response.raise_for_status()
        return response.json()
    
    def get_popular_movies(self, page: int = 1, min_rating: float = 6.5) -> List[Dict]:
        """Get popular movies with minimum rating threshold"""
        data = self._make_request("movie/popular", {"page": page})
        movies = data.get("results", [])
        # Filter by rating
        return [m for m in movies if m.get("vote_average", 0) >= min_rating]
    
    def search_movies(self, query: str, page: int = 1) -> List[Dict]:
        """Search for movies by title"""
        data = self._make_request("search/movie", {"query": query, "page": page})
        return data.get("results", [])
    
    def get_movie_details(self, movie_id: int) -> Dict:
        """Get full movie details including credits and keywords"""
        movie = self._make_request(f"movie/{movie_id}", {
            "append_to_response": "credits,keywords,external_ids"
        })
        return movie
    
    def get_genres(self) -> List[Dict]:
        """Get list of all movie genres"""
        data = self._make_request("genre/movie/list")
        return data.get("genres", [])
    
    def get_movie_credits(self, movie_id: int) -> Dict:
        """Get cast and crew for a movie"""
        return self._make_request(f"movie/{movie_id}/credits")

tmdb_client = TMDBClient()

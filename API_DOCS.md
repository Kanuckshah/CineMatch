# CineMatch API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
All user-specific endpoints require a valid Firebase UID.

---

## Endpoints

### Health Check
```
GET /
GET /health
```

Returns API status.

---

### Movies

#### Get Popular Movies
```
GET /api/movies/popular?page=1&min_rating=6.5
```

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `min_rating` (float): Minimum rating threshold (default: 6.5)

**Response:**
```json
{
  "movies": [...],
  "page": 1
}
```

#### Search Movies
```
GET /api/movies/search?q=inception&page=1
```

**Query Parameters:**
- `q` (string, required): Search query
- `page` (int): Page number

#### Get Movie Details
```
GET /api/movies/{movie_id}
```

Returns full movie details including cast, crew, and keywords.

#### Get Genres
```
GET /api/movies/genres/list
```

Returns all available movie genres.

---

### Users

#### Create User Profile
```
POST /api/users/profile
```

**Body:**
```json
{
  "uid": "firebase_uid",
  "email": "user@example.com",
  "favorite_movies": [
    {"id": 603, "title": "The Matrix"},
    {"id": 27205, "title": "Inception"}
  ],
  "preferred_genres": ["Sci-Fi", "Action", "Thriller"],
  "preferred_actors": ["Leonardo DiCaprio", "Keanu Reeves"]
}
```

#### Get User Profile
```
GET /api/users/{uid}/profile
```

---

### Recommendations

#### Get Personalized Recommendations
```
GET /api/recommendations/{uid}?limit=20&page=1
```

**Query Parameters:**
- `limit` (int): Number of recommendations (1-50)
- `page` (int): Page number

**Response:**
```json
{
  "recommendations": [
    {
      "movie": {...},
      "score": 0.87,
      "details": {
        "genres": ["Sci-Fi", "Action"],
        "actors": ["Tom Hardy", "Joseph Gordon-Levitt"]
      }
    }
  ],
  "total": 20,
  "page": 1
}
```

---

### Feedback

#### Record User Feedback
```
POST /api/feedback
```

**Body:**
```json
{
  "uid": "firebase_uid",
  "movie_id": 550,
  "action": "like"  // or "dislike"
}
```

**Response:**
```json
{
  "message": "Feedback recorded",
  "updated_weights": {
    "genre_weights": {...},
    "actor_weights": {...}
  }
}
```

---

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `404` - Not found
- `422` - Validation error
- `500` - Server error
- `503` - Service unavailable (Firestore not initialized)

**Error format:**
```json
{
  "detail": "Error message"
}
```

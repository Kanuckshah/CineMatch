from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import movies, users
import uvicorn

app = FastAPI(
    title="CineMatch API",
    description="Intelligent movie recommendation engine",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(movies.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {
        "message": "CineMatch API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

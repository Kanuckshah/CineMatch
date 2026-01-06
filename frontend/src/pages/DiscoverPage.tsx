import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/swipe/SwipeCard';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function DiscoverPage() {
    const [movies, setMovies] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        loadRecommendations();
    }, []);

    async function loadRecommendations() {
        if (!currentUser) return;

        try {
            setLoading(true);
            const response = await api.get(`/api/recommendations/${currentUser.uid}`, {
                params: { limit: 20 }
            });
            setMovies(response.data.recommendations);
        } catch (error) {
            console.error('Failed to load recommendations:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSwipe(direction: 'left' | 'right') {
        const movie = movies[currentIndex];

        // Send feedback to backend
        try {
            await api.post('/api/feedback', {
                uid: currentUser?.uid,
                movie_id: movie.movie.id,
                action: direction === 'right' ? 'like' : 'dislike'
            });
        } catch (error) {
            console.error('Failed to record feedback:', error);
        }

        // Move to next card
        setCurrentIndex((prev) => prev + 1);

        // Load more if running low
        if (currentIndex >= movies.length - 3) {
            loadRecommendations();
        }
    }

    if (loading && movies.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
                <div className="text-white text-xl">Loading recommendations...</div>
            </div>
        );
    }

    const currentMovie = movies[currentIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
            <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-8 pt-8">
                    <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                        CineMatch
                    </h1>
                    <Link
                        to="/for-you"
                        className="text-sm text-primary-400 hover:text-primary-300 font-semibold"
                    >
                        Browse All
                    </Link>
                </div>

                <div className="relative h-[600px] mb-8">
                    <AnimatePresence>
                        {currentMovie && (
                            <SwipeCard
                                key={currentMovie.movie.id}
                                movie={currentMovie}
                                onSwipe={handleSwipe}
                            />
                        )}
                    </AnimatePresence>

                    {!currentMovie && movies.length > 0 && (
                        <div className="flex items-center justify-center h-full glass-effect rounded-3xl">
                            <div className="text-center">
                                <p className="text-2xl text-white mb-4">No more movies!</p>
                                <button
                                    onClick={loadRecommendations}
                                    className="px-8 py-3 gradient-primary rounded-full text-white font-semibold"
                                >
                                    Load More
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={() => handleSwipe('left')}
                        className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 text-red-500 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button
                        onClick={() => handleSwipe('right')}
                        className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 text-green-500 flex items-center justify-center hover:bg-green-500/30 transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

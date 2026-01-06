import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function ForYouPage() {
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        loadRecommendations();
    }, []);

    async function loadRecommendations() {
        if (!currentUser) return;

        try {
            const response = await api.get(`/api/recommendations/${currentUser.uid}`, {
                params: { limit: 30 }
            });
            setRecommendations(response.data.recommendations);
        } catch (error) {
            console.error('Failed to load recommendations:', error);
        } finally {
            setLoading(false);
        }
    }

    const categories = {
        perfectMatch: recommendations.filter(r => r.score > 0.8),
        basedOnFavorites: recommendations.filter(r => r.score > 0.6 && r.score <= 0.8),
        discover: recommendations.filter(r => r.score > 0.4 && r.score <= 0.6),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <div className="max-w-7xl mx-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                        For You
                    </h1>
                    <Link
                        to="/discover"
                        className="px-6 py-3 gradient-primary rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                        Swipe Mode
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading recommendations...</div>
                ) : (
                    <div className="space-y-12">
                        {categories.perfectMatch.length > 0 && (
                            <Section title="Perfect Matches" movies={categories.perfectMatch} />
                        )}

                        {categories.basedOnFavorites.length > 0 && (
                            <Section title="Based on Your Favorites" movies={categories.basedOnFavorites} />
                        )}

                        {categories.discover.length > 0 && (
                            <Section title="Discover Something New" movies={categories.discover} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Section({ title, movies }: { title: string; movies: any[] }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movies.slice(0, 12).map((item, index) => (
                    <MoviePoster key={index} movie={item} />
                ))}
            </div>
        </div>
    );
}

function MoviePoster({ movie }: { movie: any }) {
    const posterUrl = movie.movie.poster_path
        ? `${POSTER_BASE_URL}${movie.movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative rounded-xl overflow-hidden group cursor-pointer"
        >
            <img
                src={posterUrl}
                alt={movie.movie.title}
                className="w-full aspect-[2/3] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                    {movie.movie.title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xs">
                        ★ {movie.movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-green-400 text-xs font-semibold">
                        {Math.round(movie.score * 100)}% match
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { movieService } from '../../services/api';
import { Movie, MovieReference } from '../../types';
import MovieCard from './MovieCard';

interface MovieSelectionProps {
    onComplete: (selectedMovies: MovieReference[]) => void;
}

export default function MovieSelection({ onComplete }: MovieSelectionProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMovies, setSelectedMovies] = useState<MovieReference[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPopularMovies();
    }, []);

    async function loadPopularMovies() {
        try {
            setLoading(true);
            const data = await movieService.getPopularMovies(1, 7.0);
            setMovies(data.movies);
        } catch (error) {
            console.error('Failed to load movies:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(query: string) {
        setSearchQuery(query);
        if (query.length < 2) {
            loadPopularMovies();
            return;
        }

        try {
            setLoading(true);
            const data = await movieService.searchMovies(query);
            setMovies(data.movies);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    }

    function toggleMovie(movie: Movie) {
        const isSelected = selectedMovies.some(m => m.id === movie.id);

        if (isSelected) {
            setSelectedMovies(selectedMovies.filter(m => m.id !== movie.id));
        } else if (selectedMovies.length < 5) {
            setSelectedMovies([...selectedMovies, { id: movie.id, title: movie.title }]);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                        Pick Your Favorites
                    </h1>
                    <p className="text-gray-400">Select exactly 5 movies you love</p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-full ${i < selectedMovies.length ? 'bg-primary-500' : 'bg-gray-700'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search for movies..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading movies...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                isSelected={selectedMovies.some(m => m.id === movie.id)}
                                onClick={() => toggleMovie(movie)}
                            />
                        ))}
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={() => onComplete(selectedMovies)}
                        disabled={selectedMovies.length !== 5}
                        className="px-12 py-4 gradient-primary rounded-full text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue ({selectedMovies.length}/5)
                    </button>
                </div>
            </div>
        </div>
    );
}

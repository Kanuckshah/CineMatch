import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Genre } from '../../types';
import { movieService } from '../../services/api';

interface GenreSelectionProps {
    onComplete: (selectedGenres: string[]) => void;
    onBack: () => void;
}

export default function GenreSelection({ onComplete, onBack }: GenreSelectionProps) {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGenres();
    }, []);

    async function loadGenres() {
        try {
            const data = await movieService.getGenres();
            setGenres(data.genres);
        } catch (error) {
            console.error('Failed to load genres:', error);
        } finally {
            setLoading(false);
        }
    }

    function toggleGenre(genreName: string) {
        if (selectedGenres.includes(genreName)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genreName));
        } else if (selectedGenres.length < 5) {
            setSelectedGenres([...selectedGenres, genreName]);
        }
    }

    const canContinue = selectedGenres.length >= 3 && selectedGenres.length <= 5;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                        Choose Your Genres
                    </h1>
                    <p className="text-gray-400">Select 3-5 genres you enjoy</p>
                    <div className="mt-4 text-primary-400 font-semibold">
                        {selectedGenres.length}/5 selected
                    </div>
                </motion.div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading genres...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {genres.map((genre) => {
                            const isSelected = selectedGenres.includes(genre.name);
                            return (
                                <motion.button
                                    key={genre.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleGenre(genre.name)}
                                    className={`p-6 rounded-2xl font-semibold transition-all ${isSelected
                                            ? 'gradient-primary text-white'
                                            : 'glass-effect text-gray-300 hover:bg-white/20'
                                        }`}
                                >
                                    {genre.name}
                                </motion.button>
                            );
                        })}
                    </div>
                )}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onBack}
                        className="px-8 py-4 glass-effect rounded-full text-white font-semibold hover:bg-white/20 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => onComplete(selectedGenres)}
                        disabled={!canContinue}
                        className="px-12 py-4 gradient-primary rounded-full text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

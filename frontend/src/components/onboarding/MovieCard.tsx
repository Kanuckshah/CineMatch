import { motion } from 'framer-motion';
import { Movie } from '../../types';

interface MovieCardProps {
    movie: Movie;
    isSelected: boolean;
    onClick: () => void;
}

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie, isSelected, onClick }: MovieCardProps) {
    const posterUrl = movie.poster_path
        ? `${POSTER_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`relative cursor-pointer rounded-xl overflow-hidden group ${isSelected ? 'ring-4 ring-primary-500' : ''
                }`}
        >
            <img
                src={posterUrl}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
            />

            {isSelected && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-2 right-2 bg-primary-500 rounded-full p-2"
                >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </motion.div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <h3 className="text-white font-semibold text-sm line-clamp-2">{movie.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400 text-xs">★ {movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-300 text-xs">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Movie } from '../../types';

interface SwipeCardProps {
    movie: any;
    onSwipe: (direction: 'left' | 'right') => void;
}

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function SwipeCard({ movie, onSwipe }: SwipeCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    function handleDragEnd(_: any, info: PanInfo) {
        if (Math.abs(info.offset.x) > 100) {
            onSwipe(info.offset.x > 0 ? 'right' : 'left');
        }
    }

    const posterUrl = movie.movie.poster_path
        ? `${POSTER_BASE_URL}${movie.movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';

    const imdbId = movie.details?.external_ids?.imdb_id;

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate, opacity }}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full cursor-grab active:cursor-grabbing"
        >
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <img
                    src={posterUrl}
                    alt={movie.movie.title}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">{movie.movie.title}</h2>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-yellow-400 font-semibold">
                            ★ {movie.movie.vote_average?.toFixed(1)}
                        </span>
                        <span className="text-gray-300">
                            {movie.movie.release_date ? new Date(movie.movie.release_date).getFullYear() : 'N/A'}
                        </span>
                    </div>

                    {movie.details?.genres && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {movie.details.genres.slice(0, 3).map((genre: string) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="text-gray-200 text-sm line-clamp-3 mb-4">
                        {movie.movie.overview}
                    </p>

                    {imdbId && (
                        <a
                            href={`https://www.imdb.com/title/${imdbId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            View on IMDb
                        </a>
                    )}
                </div>

                {/* Swipe indicators */}
                <motion.div
                    style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
                    className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl rotate-12"
                >
                    LIKE
                </motion.div>

                <motion.div
                    style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
                    className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl -rotate-12"
                >
                    PASS
                </motion.div>
            </div>
        </motion.div>
    );
}

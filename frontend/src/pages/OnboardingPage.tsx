import { useState } from 'react';
import MovieSelection from '../components/onboarding/MovieSelection';
import GenreSelection from '../components/onboarding/GenreSelection';
import { MovieReference } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [selectedMovies, setSelectedMovies] = useState<MovieReference[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    function handleMoviesSelected(movies: MovieReference[]) {
        setSelectedMovies(movies);
        setStep(2);
    }

    async function handleGenresSelected(genres: string[]) {
        setSelectedGenres(genres);

        // Create user profile
        try {
            await api.post('/api/users/profile', {
                uid: currentUser?.uid,
                email: currentUser?.email,
                favorite_movies: selectedMovies,
                preferred_genres: genres,
                preferred_actors: [],
            });

            navigate('/discover');
        } catch (error) {
            console.error('Failed to create profile:', error);
        }
    }

    return (
        <div>
            {step === 1 && <MovieSelection onComplete={handleMoviesSelected} />}
            {step === 2 && (
                <GenreSelection
                    onComplete={handleGenresSelected}
                    onBack={() => setStep(1)}
                />
            )}
        </div>
    );
}

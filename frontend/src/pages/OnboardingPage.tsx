import { useState } from 'react';
import MovieSelection from '../components/onboarding/MovieSelection';
import { MovieReference } from '../types';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [selectedMovies, setSelectedMovies] = useState<MovieReference[]>([]);

    function handleMoviesSelected(movies: MovieReference[]) {
        setSelectedMovies(movies);
        setStep(2);
        // Next stages will add genre/actor selection
    }

    return (
        <div>
            {step === 1 && <MovieSelection onComplete={handleMoviesSelected} />}
        </div>
    );
}

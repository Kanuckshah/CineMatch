import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const movieService = {
    getPopularMovies: async (page = 1, minRating = 7.0) => {
        const response = await api.get('/api/movies/popular', {
            params: { page, min_rating: minRating },
        });
        return response.data;
    },

    searchMovies: async (query: string, page = 1) => {
        const response = await api.get('/api/movies/search', {
            params: { q: query, page },
        });
        return response.data;
    },

    getMovieDetails: async (movieId: number) => {
        const response = await api.get(`/api/movies/${movieId}`);
        return response.data;
    },

    getGenres: async () => {
        const response = await api.get('/api/movies/genres/list');
        return response.data;
    },
};

export default api;

export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}

export interface MovieReference {
    id: number;
    title: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
}

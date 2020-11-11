/*
 *    Queries to backend with types
 */

import gql from "graphql-tag";
import {Interval} from "./Store";

const MOVIE = gql`
    query movie($imdb_id: String!) {
        movie(imdb_id: $imdb_id) {
            original_title
            overview
            genres
            production_countries {
                name
            }
            production_companies
            runtime
            release_date
            trailer
            rating
        }
    }
`;

interface Movie {
    imdb_id?: string;
    original_title?: string;
    overview?: string;
    poster_path?: string;
    genres?: string[];
    production_countries?: {
        name: string;
    }[];
    production_companies?: string[];
    runtime?: number;
    release_date?: string;
    trailer?: string;
    rating?: number;
}

const MOVIES = gql`
    query movies(
        $search: String
        $filter: Filter
        $sortBy: SortBy
        $sortDirection: SortDirection
        $page: Int
        $pageSize: Int
    ) {
        movies(
            search: $search
            filter: $filter
            sortBy: $sortBy
            sortDirection: $sortDirection
            page: $page
            pageSize: $pageSize
        ) {
            movies {
                poster_path
                original_title
                rating
                imdb_id
            }
            pageCount
        }
    }
`;

interface MoviesVariables {
    search: string;
    sortBy: string;
    sortDirection: string;
    filter: {
        genres: string[];
        production_countries: string[];
        release_date: Interval;
        runtime: Interval;
    };
    page: number;
    pageSize: number;
}

interface Movies {
    movies: {
        movies: Movie[];
        pageCount: number;
    };
}

const FILTER_OPTIONS = gql`
    query menuOptions {
        menuOptions {
            genres
            productionCountries
            releaseDateInterval {
                start
                end
            }
            runtimeInterval {
                start
                end
            }
        }
    }
`;

interface FilterOptions {
    menuOptions: {
        genres: string[];
        productionCountries: string[];
        releaseDateInterval: Interval;
        runtimeInterval: Interval;
    };
}

export {MOVIE, Movie, MOVIES, MoviesVariables, Movies, FILTER_OPTIONS, FilterOptions};

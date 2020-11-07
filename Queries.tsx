/*
 *    Queries to backend
 */

import gql from "graphql-tag";

const CURRENT_USER = gql`
    {
        currentUser {
            username
        }
    }
`;

const LOGIN = gql`
    query loginUser($username: String!, $password: String!) {
        loginUser(username: $username, password: $password) {
            token
        }
    }
`;

const REGISTER = gql`
    mutation createUser($username: String!, $password: String!) {
        createUser(username: $username, password: $password) {
            _id
            username
        }
    }
`;

const LIKE = gql`
    mutation createLike($imdb_id: String!) {
        createLike(imdb_id: $imdb_id) {
            _id
            username
            imdb_id
        }
    }
`;

const MOVIE_DATA = gql`
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

const LIKES = gql`
    query likes($imdb_id: String!) {
        likes(imdb_id: $imdb_id) {
            likesCount
            hasLiked
        }
    }
`;

// CACHE-ONLY QUERIES
const FILTER_OPEN = gql`
    query filterOpen {
        filterOpen @client
    }
`;

const FILTER = gql`
    query filter {
        filter @client {
            genres
            productionCountries
            releaseDateInterval
            runtimeInterval
        }
    }
`;

const SORT = gql`
    query sort {
        sort @client
    }
`;

const SORT_DIRECTION = gql`
    query sortDirection {
        sortDirection @client
    }
`;

const SEARCH = gql`
    query search {
        search @client
    }
`;

export {
    CURRENT_USER,
    LOGIN,
    REGISTER,
    FILTER_OPEN,
    FILTER,
    FILTER_OPTIONS,
    MOVIES,
    SORT,
    SORT_DIRECTION,
    SEARCH,
    MOVIE_DATA,
    LIKES,
    LIKE
};

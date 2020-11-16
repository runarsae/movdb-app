import React, {useEffect, useState} from "react";
import MovieCard from "./MovieCard";
import {useQuery, useReactiveVar} from "@apollo/client";
import {Movie, MOVIES, Movies, MoviesVariables} from "../../Queries";
import {Text, View, StyleSheet, ActivityIndicator, FlatList, Dimensions, ScaledSize} from "react-native";
import {useTheme} from "react-native-paper";
import {filterVar, searchVar, sortDirectionVar, sortVar} from "../../Store";

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        paddingVertical: 15
    },
    feedback: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: 200,
        width: "100%"
    },
    feedbackText: {
        fontSize: 16
    }
});

// Initial width of window, used to calculate number of columns in flat list
const window = Dimensions.get("window");

/*
 *  Movie container for movie cards.
 *  Displays matching movies (according to search, sort and filter) in a paginated infinite scrollable list.
 */
function MovieContainer(): JSX.Element {
    const {colors} = useTheme();

    // Number of columns in the flat list; calculated based on window width
    const [numColumns, setNumColumns] = useState<number>(2);

    const [variables, setVariables] = useState<MoviesVariables>();
    const [movies, setMovies] = useState<Movie[]>([]);

    // Get filter, search and sort values from cache
    // Refetched automatically when cache is updated
    const filter = useReactiveVar(filterVar);
    const search = useReactiveVar(searchVar);
    const sort = useReactiveVar(sortVar);
    const sortDirection = useReactiveVar(sortDirectionVar);

    const PAGE_SIZE = 20;
    const [pageCount, setPageCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageLoading, setPageLoading] = useState<boolean>(true);

    // If filter, search, sort or sort direction is changed,
    // reset current page, page count and movies array
    useEffect(() => {
        // Wait till all values are recieved
        if (filter && search !== undefined && sort && sortDirection) {
            setCurrentPage(1);
            setPageCount(1);
            setMovies([]);
        }
    }, [filter, search, sort, sortDirection]);

    // If current page or movies array is changed,
    // update the variables used in the query
    useEffect(() => {
        if (currentPage) {
            updateVariables();
        }
    }, [currentPage, movies]);

    // Set variables used in query to fetch movies from backend
    const updateVariables = () => {
        if (filter && search !== undefined && sort && sortDirection && currentPage) {
            setVariables({
                search: search,
                sortBy: sort,
                sortDirection: sortDirection,
                filter: {
                    genres: filter.genres,
                    production_countries: filter.productionCountries,
                    release_date: filter.releaseDateInterval,
                    runtime: filter.runtimeInterval
                },
                page: currentPage,
                pageSize: PAGE_SIZE
            });
        }
    };

    // Fetch movies based on variables
    // Called on mount and when variables are changed
    const {data: moviesData, loading: queryLoading} = useQuery<Movies>(MOVIES, {
        variables: variables,
        skip: !variables
    });

    // On fetch, concatenate already fetched movies with the newly fetched ones
    useEffect(() => {
        if (moviesData) {
            const fetchedMovies = moviesData.movies.movies;

            setMovies((prevMovies) => prevMovies.concat(fetchedMovies));
            setPageCount(moviesData.movies.pageCount);
            setPageLoading(false);
        }
    }, [moviesData]);

    const nextPage = () => {
        // Increase current page by 1 if the previous page has loaded and there are more pages to load
        if (!pageLoading && currentPage < pageCount) {
            setPageLoading(true);
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    // The render item in the flat list; this component is generated for each item in the list
    const movie = ({item}: {item: Movie}) => (
        <MovieCard
            key={item.imdb_id!}
            imdbID={item.imdb_id!}
            rating={item.rating!}
            title={item.original_title!}
            poster={item.poster_path!}
        />
    );

    // Calculate the number of columns of the flat list based on window width
    const calculateNumColumns = ({window}: {window: ScaledSize}) => {
        // 180 is the width of each movie card (including margins)
        const newNumColumns = Math.floor(window.width / 180);

        if (newNumColumns !== numColumns) {
            setNumColumns(newNumColumns);
        }
    };

    // Trigger calculation of number of columns
    useEffect(() => {
        // Initial calculation on component render
        calculateNumColumns({window});

        // If width of window changes, recalculate the number of columns
        Dimensions.addEventListener("change", calculateNumColumns);
        return () => {
            Dimensions.removeEventListener("change", calculateNumColumns);
        };
    }, []);

    return (
        <FlatList
            contentContainerStyle={styles.container}
            data={movies}
            renderItem={movie}
            initialNumToRender={20}
            keyExtractor={(movie) => movie.imdb_id!}
            numColumns={numColumns}
            key={numColumns}
            onEndReached={nextPage}
            onEndReachedThreshold={3}
            ListFooterComponent={() => (
                <View style={styles.feedback}>
                    {!queryLoading &&
                    !pageLoading &&
                    currentPage === pageCount &&
                    pageCount !== 0 &&
                    movies.length > 0 ? (
                        // End of results
                        <Text style={[styles.feedbackText, {color: colors.primary}]}>
                            {movies.length} {movies.length === 1 ? "RESULT" : "RESULTS"}
                        </Text>
                    ) : !queryLoading && !pageLoading && pageCount === 0 && movies.length === 0 ? (
                        // No results
                        <Text style={[styles.feedbackText, {color: colors.primary}]}>NO RESULTS</Text>
                    ) : (
                        // Loading
                        <ActivityIndicator size="large" color={colors.primary} />
                    )}
                </View>
            )}
        />
    );
}

export default MovieContainer;

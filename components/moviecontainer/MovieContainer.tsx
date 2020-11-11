import React, {useEffect, useState} from "react";
import MovieCard from "./MovieCard";
import {useQuery, useReactiveVar} from "@apollo/client";
import {Movie, MOVIES, Movies, MoviesVariables} from "../../Queries";
import {Text, View, StyleSheet, ActivityIndicator, ScrollView, NativeScrollEvent} from "react-native";
import {useTheme} from "react-native-paper";
import {filterVar, searchVar, sortDirectionVar, sortVar} from "../../Store";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    movies: {
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
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

function MovieContainer(): JSX.Element {
    const {colors} = useTheme();

    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [contentHeight, setContentHeight] = useState<number>(0);

    const [variables, setVariables] = useState<MoviesVariables>();
    const [movies, setMovies] = useState<JSX.Element[]>([]);

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
            const fetchedMovies = moviesData.movies.movies.map((movie: Movie) => (
                <MovieCard
                    key={movie.imdb_id!}
                    imdbID={movie.imdb_id!}
                    rating={movie.rating!}
                    title={movie.original_title!}
                    poster={movie.poster_path!}
                />
            ));

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

    // Calculates if scrolling has reached the end (with a threshold of 400)
    const endReached = ({layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent) => {
        const threshold = 400;

        return layoutMeasurement.height + contentOffset.y >= contentSize.height - threshold;
    };

    // If content height is smaller than container height, render the next page
    // Triggers when there are not enough initial results to fill the whole container
    useEffect(() => {
        if (contentHeight && containerHeight && contentHeight < containerHeight) {
            nextPage();
        }
    }, [contentHeight, containerHeight, pageLoading, currentPage, pageCount]);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.movies}
                onScroll={({nativeEvent}) => {
                    // If scroll has reached the end, load the next page
                    if (endReached(nativeEvent)) {
                        nextPage();
                    }
                }}
                scrollEventThrottle={100}
                onContentSizeChange={(width, height) => {
                    setContentHeight(height);
                }}
                onLayout={(event) => {
                    setContainerHeight(event.nativeEvent.layout.height);
                }}
            >
                {movies}

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
            </ScrollView>
        </View>
    );
}

export default MovieContainer;

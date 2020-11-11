import React, {useEffect, useState} from "react";
import {useQuery, useReactiveVar} from "@apollo/client";
import {popupMovieVar, popupOpenVar} from "../Store";
import {MOVIE, Movie} from "../Queries";
import {StyleSheet, ActivityIndicator, ScrollView, View} from "react-native";
import {Caption, Card, IconButton, Paragraph, Title, useTheme, Text, Divider, Avatar} from "react-native-paper";
import ChipContainer from "./ChipContainer";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {format} from "date-fns";

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 5,
        paddingHorizontal: 15,
        paddingBottom: 15
    },
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    card: {
        width: "100%",
        maxWidth: 600
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
        margin: 0,
        zIndex: 1
    },
    title: {
        color: "#C2C2C2",
        paddingRight: 40,
        marginVertical: 0,
        lineHeight: 24
    },
    undertitle: {
        marginVertical: 0,
        marginLeft: -3,
        marginTop: 4
    },
    undertitleField: {
        paddingRight: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    undertitleFieldIcon: {
        backgroundColor: "transparent",
        padding: 0,
        lineHeight: 20,
        width: 20,
        height: 20,
        textAlignVertical: "bottom"
    },
    paragraph: {
        paddingTop: 16,
        marginTop: 0,
        marginBottom: 0
    },
    divider: {
        marginTop: 16
    },
    subtitle: {
        paddingTop: 16,
        fontWeight: "bold",
        color: "#C2C2C2"
    }
});

function MoviePopup(): JSX.Element | null {
    const {colors} = useTheme();

    const popupOpen = useReactiveVar(popupOpenVar);
    const popupMovie = useReactiveVar(popupMovieVar);

    const [movie, setMovie] = useState<Movie>();

    // Get movie data for the ID in store
    const {data} = useQuery<{movie: Movie}>(MOVIE, {
        variables: {imdb_id: popupMovie},
        skip: !popupMovie
    });

    // When movie data is fetched, store it in internal state
    useEffect(() => {
        if (data) {
            setMovie(data.movie);
        }
    }, [data]);

    useEffect(() => {
        if (!popupOpen) {
            setMovie(undefined);
            popupMovieVar(undefined);
        }
    }, [popupOpen]);

    if (popupOpen) {
        return (
            <ScrollView
                style={[
                    {display: popupOpen ? "flex" : "none"},
                    styles.wrapper,
                    {paddingTop: 15 + getStatusBarHeight()}
                ]}
                contentContainerStyle={styles.container}
            >
                {movie ? (
                    <Card style={styles.card}>
                        <Card.Content>
                            <IconButton
                                icon="close"
                                style={styles.closeButton}
                                color={colors.text}
                                onPress={() => popupOpenVar(false)}
                            />

                            <Title style={styles.title}>{movie.original_title!}</Title>

                            <Caption style={styles.undertitle}>
                                <UndertitleField
                                    icon="calendar"
                                    text={format(new Date(movie.release_date!), "d MMMM yyyy")}
                                />

                                <UndertitleField icon="star" text={movie.rating! + "/10"} />

                                <UndertitleField
                                    icon="clock"
                                    // Calculate hours and minutes
                                    text={Math.floor(movie.runtime! / 60) + "h " + (movie.runtime! % 60) + "min"}
                                />
                            </Caption>

                            <ChipContainer array={movie.genres!} chipBackgroundColor={colors.primary} />

                            <Paragraph style={styles.paragraph}>{movie.overview!}</Paragraph>

                            <Divider style={styles.divider} />

                            <Text style={[styles.subtitle]}>
                                Production {movie.production_companies!.length === 1 ? "company" : "companies"}
                            </Text>
                            <ChipContainer array={movie.production_companies!} chipBackgroundColor="none" />

                            <Text style={[styles.subtitle]}>
                                Production {movie.production_countries!.length === 1 ? "country" : "countries"}
                            </Text>
                            <ChipContainer
                                array={movie.production_countries!.map((country) => country.name)}
                                chipBackgroundColor="none"
                            />
                        </Card.Content>
                    </Card>
                ) : (
                    // Loading
                    <ActivityIndicator size="large" color={colors.primary} />
                )}
            </ScrollView>
        );
    } else {
        return null;
    }
}

export default MoviePopup;

function UndertitleField(props: {icon: string; text: string}) {
    return (
        <View style={styles.undertitleField}>
            <Avatar.Icon icon={props.icon} color={"#858383"} style={styles.undertitleFieldIcon} size={24} />
            <Text style={{color: "#858383"}}>{props.text}</Text>
        </View>
    );
}

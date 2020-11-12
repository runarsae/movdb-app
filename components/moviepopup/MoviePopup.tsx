import React, {useEffect, useState} from "react";
import {useQuery, useReactiveVar} from "@apollo/client";
import {popupMovieVar, popupOpenVar} from "../../Store";
import {MOVIE, Movie} from "../../Queries";
import {StyleSheet, ActivityIndicator, ScrollView, View, Dimensions, TouchableWithoutFeedback} from "react-native";
import {Caption, Card, IconButton, Paragraph, Title, useTheme, Text, Divider, Avatar} from "react-native-paper";
import ChipContainer from "./ChipContainer";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {format} from "date-fns";

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 5
    },
    container: {
        paddingHorizontal: 15,
        paddingBottom: 15,
        width: "100%",
        alignItems: "center"
    },
    touchable: {
        position: "absolute",
        width: "100%",
        height: "100%"
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

/*
 *   Field with an icon and text, used under the title of the popup
 */
function UndertitleField(props: {icon: string; text: string}): JSX.Element {
    return (
        <View style={styles.undertitleField}>
            <Avatar.Icon icon={props.icon} color={"#858383"} style={styles.undertitleFieldIcon} size={24} />
            <Text style={{color: "#858383"}}>{props.text}</Text>
        </View>
    );
}

function MoviePopup(): JSX.Element | null {
    const {colors} = useTheme();

    // Boolean used to decide how to vertically align the popup
    const [alignCenter, setAlignCenter] = useState<boolean | undefined>(false);

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

    // When popup closes, clear movie data and alignment
    useEffect(() => {
        if (!popupOpen) {
            setMovie(undefined);
            popupMovieVar(undefined);
            setAlignCenter(undefined);
        }
    }, [popupOpen]);

    if (popupOpen) {
        return (
            <ScrollView
                style={styles.wrapper}
                contentContainerStyle={[
                    styles.container,
                    {paddingTop: 15 + getStatusBarHeight()},
                    // If alignment is not decided yet, make the view invisible
                    {opacity: typeof alignCenter === "undefined" && movie ? 0 : 1},

                    // Center vertically if alignCenter is true or if the movie is loading (centers loading icon)
                    alignCenter || !movie ? {justifyContent: "center", height: "100%"} : {justifyContent: "flex-start"}
                ]}
            >
                {/* ScrollView overlaps the backdrop component. A touchable that covers 
                the whole screen is necessary to close the popup on backdrop click */}
                <TouchableWithoutFeedback onPress={() => popupOpenVar(false)}>
                    <View style={styles.touchable}></View>
                </TouchableWithoutFeedback>

                {movie ? (
                    <Card
                        style={styles.card}
                        onLayout={(event) => {
                            const height = event.nativeEvent.layout.height;
                            const windowHeight = Dimensions.get("window").height;

                            // If height of card (+ padding) is smaller than the window height, center it vertically
                            height + 30 < windowHeight ? setAlignCenter(true) : setAlignCenter(false);
                        }}
                    >
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
                                    // Convert minutes into hours and minutes
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

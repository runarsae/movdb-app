import React, {useEffect, useRef, useState} from "react";
import {useQuery, useReactiveVar} from "@apollo/client";
import {popupMovieVar, popupOpenVar} from "../../Store";
import {MOVIE, Movie} from "../../Queries";
import {StyleSheet, ScrollView, View} from "react-native";
import {Caption, Card, IconButton, Paragraph, Title, useTheme, Text, Divider, Avatar} from "react-native-paper";
import ChipContainer from "./ChipContainer";
import {format} from "date-fns";
import YoutubePlayer from "react-native-youtube-iframe";
import * as Animatable from "react-native-animatable";
import {getStatusBarHeight} from "react-native-status-bar-height";

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "100%",
        zIndex: 5
    },
    scrollViewWrapper: {
        width: "100%",
        height: "100%"
    },
    scrollViewContainer: {
        width: "100%",
        paddingHorizontal: 15,
        paddingBottom: 16,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    card: {
        width: "100%",
        maxWidth: 600,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
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
        marginBottom: 0
    },
    subtitle: {
        fontWeight: "bold",
        color: "#C2C2C2"
    },
    marginTop: {
        marginTop: 16
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

    const [popupWidth, setPopupWidth] = useState<number>(0);
    const [popupHeight, setPopupHeight] = useState<number>(0);

    const popupOpen = useReactiveVar(popupOpenVar);
    const popupMovie = useReactiveVar(popupMovieVar);

    const [movie, setMovie] = useState<Movie | undefined>(undefined);

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

    const animationViewRef = useRef<Animatable.View & View>(null);
    const [animationViewHeight, setAnimationViewHeight] = useState<number>(0);

    useEffect(() => {
        if (popupOpen && movie) {
            // On open, slide up based on height of animation view
            animationViewRef.current?.transitionTo({transform: [{translateY: -animationViewHeight}]}, 250, "ease");
        } else if (!popupOpen) {
            // On close, slide down
            animationViewRef.current?.transitionTo({transform: [{translateY: 0}]}, 200, "ease");
        }
    }, [popupOpen, movie]);

    return (
        <Animatable.View
            pointerEvents="box-none"
            ref={animationViewRef}
            onTransitionEnd={() => {
                if (!popupOpen && movie) {
                    // Clear movie data when popup closes
                    setMovie(undefined);
                    popupMovieVar(undefined);
                }
            }}
            style={[styles.wrapper, {marginTop: getStatusBarHeight()}]}
            onLayout={(event) => {
                // Get height of animation view
                const {height} = event.nativeEvent.layout;

                if (height != animationViewHeight) {
                    setAnimationViewHeight(height);
                }
            }}
        >
            {movie && (
                <ScrollView
                    style={styles.scrollViewWrapper}
                    contentContainerStyle={[
                        styles.scrollViewContainer,
                        {
                            paddingTop:
                                // Minimum top padding of 71 (header height + margin).
                                // If popup height is less than animation view height,
                                // the padding is increased to fill the remaining space.
                                popupHeight + 71 < animationViewHeight ? animationViewHeight - (popupHeight + 16) : 71
                        }
                    ]}
                >
                    <Card
                        style={styles.card}
                        onLayout={(event) => {
                            // Get popup width and height
                            const {width, height} = event.nativeEvent.layout;

                            if (width != popupWidth) {
                                setPopupWidth(width);
                            }

                            if (height != popupHeight) {
                                setPopupHeight(height);
                            }
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

                            <View style={styles.marginTop}>
                                <YoutubePlayer
                                    initialPlayerParams={{modestbranding: true, rel: false, loop: true}}
                                    videoId={movie.trailer!}
                                    height={((popupWidth - 32) / 16) * 9} // 16:9 ratio
                                    webViewProps={{
                                        scrollEnabled: false
                                    }}
                                    webViewStyle={{
                                        borderRadius: 4
                                    }}
                                />
                            </View>

                            <Paragraph style={[styles.paragraph, styles.marginTop]}>{movie.overview!}</Paragraph>

                            <Divider style={styles.marginTop} />

                            <Text style={[styles.subtitle, styles.marginTop]}>
                                Production {movie.production_companies!.length === 1 ? "company" : "companies"}
                            </Text>
                            <ChipContainer array={movie.production_companies!} chipBackgroundColor="none" />

                            <Text style={[styles.subtitle, styles.marginTop]}>
                                Production {movie.production_countries!.length === 1 ? "country" : "countries"}
                            </Text>
                            <ChipContainer
                                array={movie.production_countries!.map((country) => country.name)}
                                chipBackgroundColor="none"
                            />
                        </Card.Content>
                    </Card>
                </ScrollView>
            )}
        </Animatable.View>
    );
}

export default MoviePopup;

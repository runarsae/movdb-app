import React, {memo} from "react";
import {StyleSheet, Text, TouchableHighlight, View, Image} from "react-native";
import {Card, useTheme} from "react-native-paper";
import {popupMovieVar, popupOpenVar} from "../Store";

const styles = StyleSheet.create({
    movie: {
        width: 150,
        height: 225,
        padding: 0,
        borderWidth: 0,
        borderRadius: 4,
        overflow: "hidden",
        margin: 15
    },
    moviePoster: {
        width: 150,
        height: 225
    },
    ratingBox: {
        position: "absolute",
        right: 4,
        bottom: 4,
        width: 28,
        padding: 4,
        borderRadius: 4
    },
    ratingText: {
        color: "white",
        fontSize: 12,
        textAlign: "center"
    }
});

// Rating colors from red (1) to green (10)
const ratingColors = [
    "#d23600",
    "#c64d00",
    "#b95f00",
    "#ab6d00",
    "#9c7900",
    "#8c8300",
    "#7b8c00",
    "#6a9410",
    "#589a2f",
    "#43a047"
];

interface Props {
    imdbID: string;
    poster: string;
    title: string;
    rating: number;
}

function MovieCard(props: Props): JSX.Element {
    const {colors} = useTheme();

    const posterURL = "https://image.tmdb.org/t/p/w400/" + props.poster;

    return (
        <Card style={styles.movie}>
            <TouchableHighlight
                onPress={() => {
                    popupMovieVar(props.imdbID);
                    popupOpenVar(true);
                }}
                underlayColor="black"
                activeOpacity={0.7}
            >
                <View>
                    <Image style={[styles.moviePoster, {backgroundColor: colors.surface}]} source={{uri: posterURL}} />
                    <View style={[styles.ratingBox, {backgroundColor: ratingColors[Math.round(props.rating) - 1]}]}>
                        <Text style={styles.ratingText}>{props.rating}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        </Card>
    );
}

// Render MovieCard as a memoized component for performence boost
// https://reactjs.org/docs/react-api.html#reactmemo
export default memo(MovieCard);

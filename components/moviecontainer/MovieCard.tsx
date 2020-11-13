import React, {memo} from "react";
import {StyleSheet, Text, TouchableHighlight, View, Image} from "react-native";
import {Avatar, Card, useTheme} from "react-native-paper";
import {popupMovieVar, popupOpenVar} from "../../Store";

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
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingRight: 4,
        paddingLeft: 3,
        borderRadius: 4,
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    ratingIcon: {
        backgroundColor: "transparent",
        paddingTop: 2,
        marginRight: 2,
        width: 12,
        height: 14
    },
    ratingText: {
        color: "white",
        fontSize: 12
    }
});

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
                    <View style={styles.ratingBox}>
                        <Avatar.Icon icon="star" color={colors.primary} style={styles.ratingIcon} size={18} />
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

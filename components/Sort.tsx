import React, {useEffect, useState} from "react";
import {useReactiveVar} from "@apollo/client";
import {StyleSheet, View} from "react-native";
import {Surface, Chip, useTheme} from "react-native-paper";
import {searchVar, sortDirectionVar, sortOpenVar, sortVar, SortType, SortDirectionType} from "../Store";
import * as Animatable from "react-native-animatable";

const styles = StyleSheet.create({
    subbar: {
        position: "absolute",
        width: "100%",
        zIndex: 2
    },
    container: {
        padding: 8,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    chipContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        maxWidth: "100%",
        paddingTop: 8,
        paddingHorizontal: 8
    },
    chip: {
        marginBottom: 8
    },
    chipMarginRight: {
        marginRight: 8
    },
    chipText: {
        marginVertical: 0,
        paddingTop: 2
    }
});

function Sort(): JSX.Element {
    const {colors} = useTheme();

    // Height of sort bar
    const [sortHeight, setSortHeight] = useState<number>(100);

    const sortOpen = useReactiveVar(sortOpenVar);
    const sort = useReactiveVar(sortVar);
    const sortDirection = useReactiveVar(sortDirectionVar);

    const search = useReactiveVar(searchVar);

    // If search value is none, set sorting to rating DESC,
    // else, set sort to "none", which means sort by relevance to search
    useEffect(() => {
        if (search === "") {
            sortVar("rating");
            sortDirectionVar("DESC");
        } else {
            sortVar("none");
        }
    }, [search]);

    // Update sort state when a new sort is clicked
    const handleSortByClick = (newSort: SortType) => {
        if (newSort !== sort) {
            sortVar(newSort);
        } else {
            sortVar("none");
        }
    };

    // Update sort direction state when a new sort direction is clicked
    const handleSortDirectionClick = (newSortDirection: SortDirectionType) => {
        if (newSortDirection !== sortDirection) {
            sortDirectionVar(newSortDirection);
        }
    };

    return (
        <Animatable.View
            transition={"bottom"}
            duration={250}
            style={[
                styles.subbar,
                {
                    // Calculate where to place sort bar according to its height
                    bottom: sortOpen ? -sortHeight + 1 : 10
                }
            ]}
            onLayout={(event) => {
                // Get height of sort bar
                var {height} = event.nativeEvent.layout;
                if (Math.abs(height - sortHeight) > 2) {
                    setSortHeight(height);
                }
            }}
        >
            <Surface style={styles.container}>
                <View style={styles.chipContainer}>
                    <Chip
                        icon="star"
                        style={[
                            styles.chip,
                            styles.chipMarginRight,
                            sort === "rating" ? {backgroundColor: colors.primary} : {}
                        ]}
                        selectedColor={sort === "rating" ? "#000000" : colors.text}
                        textStyle={styles.chipText}
                        onPress={() => handleSortByClick("rating")}
                    >
                        Rating
                    </Chip>

                    <Chip
                        icon="sort-alphabetical"
                        style={[
                            styles.chip,
                            styles.chipMarginRight,
                            sort === "original_title" ? {backgroundColor: colors.primary} : {}
                        ]}
                        selectedColor={sort === "original_title" ? "#000000" : colors.text}
                        textStyle={styles.chipText}
                        onPress={() => handleSortByClick("original_title")}
                    >
                        Title
                    </Chip>

                    <Chip
                        icon="clock"
                        style={[
                            styles.chip,
                            styles.chipMarginRight,
                            sort === "runtime" ? {backgroundColor: colors.primary} : {}
                        ]}
                        selectedColor={sort === "runtime" ? "#000000" : colors.text}
                        textStyle={styles.chipText}
                        onPress={() => handleSortByClick("runtime")}
                    >
                        Runtime
                    </Chip>

                    <Chip
                        icon="calendar"
                        style={[styles.chip, sort === "release_date" ? {backgroundColor: colors.primary} : {}]}
                        selectedColor={sort === "release_date" ? "#000000" : colors.text}
                        textStyle={styles.chipText}
                        onPress={() => handleSortByClick("release_date")}
                    >
                        Release date
                    </Chip>
                </View>

                <View style={styles.chipContainer}>
                    <Chip
                        icon="arrow-up"
                        style={[
                            styles.chip,
                            styles.chipMarginRight,
                            sortDirection === "ASC" && sort !== "none" ? {backgroundColor: colors.accent} : {}
                        ]}
                        selectedColor={sortDirection === "ASC" && sort !== "none" ? "#000000" : colors.text}
                        textStyle={styles.chipText}
                        onPress={() => handleSortDirectionClick("ASC")}
                        disabled={sort === "none"}
                    >
                        ASC
                    </Chip>

                    <Chip
                        icon="arrow-down"
                        style={[
                            styles.chip,
                            sortDirection === "DESC" && sort !== "none" ? {backgroundColor: colors.accent} : {}
                        ]}
                        selectedColor={sortDirection === "DESC" && sort !== "none" ? "#000000" : colors.text}
                        textStyle={styles.chipText}
                        onPress={() => handleSortDirectionClick("DESC")}
                        disabled={sort === "none"}
                    >
                        DESC
                    </Chip>
                </View>
            </Surface>
        </Animatable.View>
    );
}

export default Sort;

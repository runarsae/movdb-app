import React, {useEffect, useState} from "react";
import {useReactiveVar} from "@apollo/client";
import {ScrollView, StyleSheet} from "react-native";
import {Surface, Chip, useTheme} from "react-native-paper";
import {searchVar, sortDirectionVar, sortOpenVar, sortVar, SortType, SortDirectionType} from "../../Store";
import * as Animatable from "react-native-animatable";
import {getStatusBarHeight} from "react-native-status-bar-height";

const styles = StyleSheet.create({
    subbar: {
        position: "absolute",
        bottom: "100%",
        left: 0,
        width: "100%",
        zIndex: 2
    },
    container: {
        padding: 16,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    chip: {
        borderWidth: 0
    },
    chipMarginRight: {
        marginRight: 8
    },
    chipText: {
        marginBottom: -2,
        marginTop: 0
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
            transition={"translateY"}
            duration={250}
            style={[
                styles.subbar,
                {
                    // Use height of sort bar to place it correctly when it is open
                    transform: [
                        {translateY: sortOpen ? getStatusBarHeight() + 56 + sortHeight : -(getStatusBarHeight() + 51)}
                    ]
                }
            ]}
            onLayout={(event) => {
                // Get height of sort bar
                const {height} = event.nativeEvent.layout;
                if (Math.abs(height - sortHeight) > 2) {
                    setSortHeight(height);
                }
            }}
        >
            <Surface style={styles.container}>
                <ScrollView style={{marginBottom: 16}} horizontal={true} showsHorizontalScrollIndicator={false}>
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
                </ScrollView>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
                </ScrollView>
            </Surface>
        </Animatable.View>
    );
}

export default Sort;

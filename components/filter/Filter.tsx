import React, {useEffect, useState} from "react";
import {useQuery, useReactiveVar} from "@apollo/client";
import {FilterOptions, FILTER_OPTIONS} from "../../Queries";
import {Dimensions, ScaledSize, ScrollView, StyleSheet, View} from "react-native";
import {filterOpenVar, filterTempVar, FilterType, filterVar, Interval} from "../../Store";
import * as Animatable from "react-native-animatable";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {Button, Headline, IconButton, Subheading, Surface, useTheme} from "react-native-paper";
import MultipleSelect from "./MultipleSelect";
import RangeSlider from "./RangeSlider";

const styles = StyleSheet.create({
    drawer: {
        zIndex: 6,
        position: "absolute",
        left: "100%",
        top: 0,
        width: "100%",
        height: "100%"
    },
    container: {
        zIndex: 6,
        height: "100%"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        paddingBottom: 15
    },
    closeButton: {
        margin: 0
    },
    marginVertical: {
        marginVertical: 15
    },
    subheading: {
        marginBottom: 10
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginVertical: 15
    }
});

function Filter(): JSX.Element {
    const {colors} = useTheme();

    // Boolean used to disable scrolling of menu when range sliders are in use
    const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);

    // Window width used to decide when filter menu should cover the whole width
    const [windowWidth, setWindowWidth] = useState<number>(Dimensions.get("window").width);

    // Width of filter menu; used to decide how far to slide it in when menu is open
    const [filterWidth, setFilterWidth] = useState<number>(400);

    // Get filter data from store, updates when changed
    const filterOpen = useReactiveVar(filterOpenVar);
    const filterTemp = useReactiveVar(filterTempVar);
    const filter = useReactiveVar(filterVar);

    // Get filter options from backend, and use them to set default values
    const {data: filterOptionsData} = useQuery<FilterOptions>(FILTER_OPTIONS, {
        onCompleted: () => {
            setDefaultFilterValues(false);
        }
    });

    /*
        Use filter options to set default values in store
        @temporary: set default values only to temporary filter values
    */
    const setDefaultFilterValues = (temporary: boolean) => {
        if (filterOptionsData) {
            const options = filterOptionsData.menuOptions;

            const defaultFilterValues: FilterType = {
                genres: [],
                productionCountries: [],
                releaseDateInterval: {
                    start: options.releaseDateInterval.start,
                    end: options.releaseDateInterval.end
                },
                runtimeInterval: {
                    start: options.runtimeInterval.start,
                    end: options.runtimeInterval.end
                }
            };

            filterTempVar(defaultFilterValues);

            if (!temporary) {
                filterVar(defaultFilterValues);
            }
        }
    };

    // Update temporary filter values for the given type
    const updateFilterTemp = (
        type: "genres" | "releaseDateInterval" | "runtimeInterval",
        value: Interval | string[]
    ) => {
        if (filterTemp) {
            const updatedFilter = {
                ...filterTemp,
                [type]: value
            };

            filterTempVar(updatedFilter);
        }
    };

    // When filter is closed, set temporary values to be the real filter values if they are changed
    useEffect(() => {
        if (!filterOpen && JSON.stringify(filterTemp) !== JSON.stringify(filter)) {
            filterVar(filterTemp);
        }
    }, [filterOpen, filter, filterTemp]);

    // Update window width on resize
    useEffect(() => {
        const onChange = ({window}: {window: ScaledSize}) => {
            setWindowWidth(window.width);
        };

        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    return (
        <Animatable.View
            transition={"translateX"}
            duration={250}
            style={[
                styles.drawer,
                windowWidth >= 500 && {maxWidth: 400},
                {
                    // On open, slide it in on the right according to its width
                    transform: [{translateX: filterOpen ? -filterWidth : 0}]
                }
            ]}
            onLayout={(event) => {
                // Get width of filter menu
                const {width} = event.nativeEvent.layout;
                if (width !== filterWidth) {
                    setFilterWidth(width);
                }
            }}
        >
            {
                // When filter options are fetched, the filter menu can be displayed
                filterOptionsData && filterTemp && (
                    <Surface style={[styles.container, {paddingTop: 15 + getStatusBarHeight()}]}>
                        <View style={styles.header}>
                            <Headline style={{fontSize: 22}}>Filter</Headline>
                            <IconButton
                                icon="close"
                                style={[styles.closeButton]}
                                color={colors.text}
                                onPress={() => {
                                    filterOpenVar(false);
                                }}
                            />
                        </View>

                        <ScrollView style={{paddingHorizontal: 30}} scrollEnabled={scrollEnabled}>
                            <View>
                                <View style={{marginBottom: 15}}>
                                    <Subheading style={[styles.subheading, {color: colors.primary}]}>Genres</Subheading>
                                    <MultipleSelect
                                        options={filterOptionsData.menuOptions.genres}
                                        value={filterTemp.genres}
                                        onChangeSelect={(select: string[]) => updateFilterTemp("genres", select)}
                                    />
                                </View>

                                <View style={styles.marginVertical}>
                                    <Subheading style={[styles.subheading, {color: colors.primary}]}>
                                        Release year
                                    </Subheading>
                                    <RangeSlider
                                        min={filterOptionsData.menuOptions.releaseDateInterval.start}
                                        max={filterOptionsData.menuOptions.releaseDateInterval.end}
                                        value={filterTemp.releaseDateInterval}
                                        onChangeInterval={(interval: Interval) =>
                                            updateFilterTemp("releaseDateInterval", interval)
                                        }
                                        scrollEnabled={(scrollEnabled) => {
                                            setScrollEnabled(scrollEnabled);
                                        }}
                                        width={filterWidth - 60}
                                    />
                                </View>

                                <View style={styles.marginVertical}>
                                    <Subheading style={[styles.subheading, {color: colors.primary}]}>
                                        Runtime
                                    </Subheading>
                                    <RangeSlider
                                        min={filterOptionsData.menuOptions.runtimeInterval.start}
                                        max={filterOptionsData.menuOptions.runtimeInterval.end}
                                        value={filterTemp.runtimeInterval}
                                        onChangeInterval={(interval: Interval) =>
                                            updateFilterTemp("runtimeInterval", interval)
                                        }
                                        scrollEnabled={(scrollEnabled) => {
                                            setScrollEnabled(scrollEnabled);
                                        }}
                                        width={filterWidth - 60}
                                    />
                                </View>

                                <View style={[styles.buttonContainer]}>
                                    <Button
                                        mode="text"
                                        style={{marginRight: 10}}
                                        color={colors.accent}
                                        onPress={() => setDefaultFilterValues(true)}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        mode="contained"
                                        onPress={() => {
                                            filterOpenVar(false);
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </View>
                            </View>
                        </ScrollView>
                    </Surface>
                )
            }
        </Animatable.View>
    );
}

export default Filter;

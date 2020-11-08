import React, {useEffect, useState} from "react";
import {useQuery, useReactiveVar} from "@apollo/client";
import {FilterOptions, FILTER_OPTIONS} from "../Queries";
import {Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, View} from "react-native";
import {filterOpenVar, filterTempVar, FilterType, filterVar, Interval} from "../Store";
import * as Animatable from "react-native-animatable";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {Button, Headline, IconButton, Subheading, Surface, useTheme} from "react-native-paper";
import MultipleSelect from "./MultipleSelect";
import NumberIntervalInput from "./NumberIntervalInput";

const styles = StyleSheet.create({
    drawer: {
        zIndex: 6,
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        maxWidth: 400
    },
    container: {
        height: "100%"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        paddingBottom: 30
    },
    closeButton: {
        margin: 0
    },
    marginVertical: {
        marginVertical: 20
    },
    subheading: {
        marginBottom: 10
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginVertical: 40
    }
});

function Filter() {
    const {colors} = useTheme();

    // Width of filter menu; used to decide how far to slide it out when closed
    const [filterWidth, setFilterWidth] = useState<number>(400);

    // Get filter data from store, updates when changed
    const filterOpen = useReactiveVar(filterOpenVar);
    const filterTemp = useReactiveVar(filterTempVar);
    const filter = useReactiveVar(filterVar);

    // Get filter options from backend
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

    // When filter options are fetched, use them to set default values (in store)
    useEffect(() => {
        //setDefaultFilterValues(false);
    }, [filterOptionsData]);

    // Update temporary filter values for the given type
    const updateFilterTemp = (
        type: "genres" | "releaseDateInterval" | "runtimeInterval",
        value: Interval | string[]
    ) => {
        const updatedFilter = {
            ...filterTemp!,
            [type]: value
        };

        filterTempVar(updatedFilter);
    };

    // When filter is closed, set temporary values to be the real filter values if they are changed
    useEffect(() => {
        if (!filterOpen && JSON.stringify(filterTemp) !== JSON.stringify(filter)) {
            filterVar(filterTemp);
        }
    }, [filterOpen, filter, filterTemp]);

    return (
        <Animatable.View
            transition={"right"}
            duration={250}
            style={[
                styles.drawer,
                {
                    // On closed, slide it out on the right according to its width
                    right: filterOpen ? 0 : -filterWidth
                }
            ]}
            onLayout={(event) => {
                // Get width of filter menu
                var {width} = event.nativeEvent.layout;
                if (width !== filterWidth) {
                    setFilterWidth(width);
                }
            }}
        >
            {
                // When filter options are fetched, the filter menu can be displayed
                filterOptionsData && filterTemp && (
                    <Surface style={[styles.container, {paddingTop: 30 + getStatusBarHeight()}]}>
                        <View style={styles.header}>
                            <Headline style={{fontSize: 22}}>Filter</Headline>
                            <IconButton
                                icon="close"
                                style={[styles.closeButton]}
                                color={colors.text}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    filterOpenVar(false);
                                }}
                            />
                        </View>

                        {/* KeyboardAvoidingView is used to scroll input fields into visible area when focused */}
                        <KeyboardAvoidingView
                            behavior="position"
                            style={{flex: 1, flexDirection: "column", overflow: "hidden"}}
                        >
                            <ScrollView style={{paddingHorizontal: 30}}>
                                <View>
                                    <View style={{marginBottom: 20}}>
                                        <Subheading style={[styles.subheading, {color: colors.primary}]}>
                                            Genres
                                        </Subheading>
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
                                        <NumberIntervalInput
                                            min={filterOptionsData.menuOptions.releaseDateInterval.start}
                                            max={filterOptionsData.menuOptions.releaseDateInterval.end}
                                            value={filterTemp.releaseDateInterval}
                                            onChangeInterval={(interval: Interval) =>
                                                updateFilterTemp("releaseDateInterval", interval)
                                            }
                                        />
                                    </View>

                                    <View style={styles.marginVertical}>
                                        <Subheading style={[styles.subheading, {color: colors.primary}]}>
                                            Runtime
                                        </Subheading>
                                        <NumberIntervalInput
                                            min={filterOptionsData.menuOptions.runtimeInterval.start}
                                            max={filterOptionsData.menuOptions.runtimeInterval.end}
                                            value={filterTemp.runtimeInterval}
                                            onChangeInterval={(interval: Interval) =>
                                                updateFilterTemp("runtimeInterval", interval)
                                            }
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
                                                Keyboard.dismiss();
                                                filterOpenVar(false);
                                            }}
                                        >
                                            Apply
                                        </Button>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </Surface>
                )
            }
        </Animatable.View>
    );
}

export default Filter;

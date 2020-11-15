import React from "react";
import {View, StyleSheet} from "react-native";
import {Chip, useTheme} from "react-native-paper";

const styles = StyleSheet.create({
    chipContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 8
    },
    chip: {
        marginBottom: 6,
        marginRight: 6,
        borderWidth: 0
    },
    chipText: {
        marginBottom: -2,
        marginTop: 0
    }
});

interface Props {
    array: string[];
    chipBackgroundColor: string;
}

/*
 *  Chip container component that generates an array of chips from the given values.
 */
function ChipContainer(props: Props): JSX.Element {
    const {colors} = useTheme();

    return (
        <View style={styles.chipContainer}>
            {props.array.map((item) => (
                <Chip
                    key={item}
                    style={[
                        styles.chip,
                        props.chipBackgroundColor === "none" ? {} : {backgroundColor: props.chipBackgroundColor}
                    ]}
                    selectedColor={props.chipBackgroundColor === "none" ? colors.text : "black"}
                    textStyle={styles.chipText}
                >
                    {item}
                </Chip>
            ))}
        </View>
    );
}

export default ChipContainer;

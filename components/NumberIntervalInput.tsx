import React, {useEffect, useState} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {useTheme} from "react-native-paper";
import {Interval} from "../Store";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        width: 59,
        height: 36,
        fontSize: 16,
        backgroundColor: "#383838",
        borderRadius: 4,
        paddingHorizontal: 12
    },
    separator: {
        width: 5,
        height: 1,
        marginHorizontal: 12,
        borderRadius: 1
    }
});

interface Props {
    min: number;
    max: number;
    onChangeInterval: (interval: Interval) => void;
    value: Interval;
}

function NumberIntervalInput(props: Props): JSX.Element {
    const {colors} = useTheme();

    const [interval, setInterval] = useState<Interval>(props.value);

    // When prop value change, update internal state
    useEffect(() => {
        setInterval(props.value);
    }, [props.value, setInterval]);

    // When internal interval state change, call on change prop
    useEffect(() => {
        props.onChangeInterval(interval);
    }, [interval]);

    // Update internal state when values change
    const handleChange = (type: string, valueString: string) => {
        if (valueString.length <= props.max.toString().length) {
            let valueNumber = 0;

            if (valueString.length > 0) {
                valueNumber = parseInt(valueString);
            }

            setInterval((prevState) => ({
                ...prevState,
                [type]: valueNumber
            }));
        }
    };

    const validateStart = () => {
        if (interval.start < props.min) {
            // Interval start can not be smaller than minimum value
            setInterval((prevState) => ({
                ...prevState,
                start: props.min
            }));
        } else if (interval.start > interval.end) {
            // Interval start can not be larger than interval end
            setInterval((prevState) => ({
                ...prevState,
                start: interval.end
            }));
        }
    };

    const validateEnd = () => {
        if (interval.end > props.max) {
            // Interval end can not be larger than maximum value
            setInterval((prevState) => ({
                ...prevState,
                end: props.max
            }));
        } else if (interval.end < interval.start) {
            // Interval end can not be smaller than interval start

            setInterval((prevState) => ({
                ...prevState,
                end: interval.start
            }));
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, {color: colors.text}]}
                selectionColor={colors.primary}
                onChangeText={(text) => handleChange("start", text)}
                value={interval.start !== 0 ? interval.start.toString() : ""}
                onBlur={validateStart}
                onSubmitEditing={validateStart}
            />

            <View style={[styles.separator, {backgroundColor: colors.placeholder}]} />

            <TextInput
                style={[styles.input, {color: colors.text}]}
                selectionColor={colors.primary}
                onChangeText={(text) => handleChange("end", text)}
                value={interval.end !== 0 ? interval.end.toString() : ""}
                onBlur={validateEnd}
                onSubmitEditing={validateEnd}
            />
        </View>
    );
}

export default NumberIntervalInput;

import MultiSlider, {LabelProps, MarkerProps} from "@ptomasroos/react-native-multi-slider";
import React from "react";
import {Text, View, StyleSheet} from "react-native";
import {Surface, useTheme} from "react-native-paper";
import {Interval} from "../../Store";

/*
 *   Custom knob component for the range slider.
 */
function Marker(props: MarkerProps): JSX.Element {
    const {colors} = useTheme();

    return (
        <View
            style={{
                width: 16,
                height: 16,
                backgroundColor: props.pressed ? "#A9A9A9" : colors.accent,
                borderRadius: 8
            }}
        />
    );
}

const labelStyles = StyleSheet.create({
    container: {
        position: "absolute",
        top: -15,
        left: -20
    },
    labelContainer: {
        position: "absolute",
        width: 40,
        backgroundColor: "#383838",
        borderRadius: 4,
        paddingVertical: 2
    },
    labelText: {
        textAlign: "center"
    }
});

/*
 *   Custom label component for range slider
 */
function Label(props: LabelProps): JSX.Element {
    const {colors} = useTheme();

    return (
        <View style={labelStyles.container}>
            <Surface style={[labelStyles.labelContainer, {left: props.oneMarkerLeftPosition}]}>
                <Text style={[labelStyles.labelText, {color: colors.text}]}>{props.oneMarkerValue}</Text>
            </Surface>
            <Surface style={[labelStyles.labelContainer, {left: props.twoMarkerLeftPosition}]}>
                <Text style={[labelStyles.labelText, {color: colors.text}]}>{props.twoMarkerValue}</Text>
            </Surface>
        </View>
    );
}

interface Props {
    min: number;
    max: number;
    onChangeInterval: (interval: Interval) => void;
    scrollEnabled: (scrollEnabled: boolean) => void;
    value: Interval;
    width: number;
}

/*
 *   Range slider component for choosing an interval of continuous values.
 */
function RangeSlider(props: Props): JSX.Element {
    const {colors} = useTheme();

    return (
        <View style={{paddingHorizontal: 20, paddingTop: 15}}>
            <MultiSlider
                values={[props.value.start, props.value.end]}
                onValuesChangeStart={() => {
                    props.scrollEnabled(false);
                }}
                onValuesChangeFinish={(values) => {
                    props.scrollEnabled(true);
                    props.onChangeInterval({start: values[0], end: values[1]});
                }}
                min={props.min}
                max={props.max}
                step={1}
                allowOverlap
                enableLabel
                selectedStyle={{
                    backgroundColor: colors.primary
                }}
                unselectedStyle={{
                    backgroundColor: "#383838"
                }}
                customMarker={Marker}
                customLabel={Label}
                sliderLength={props.width - 40}
            />
        </View>
    );
}

export default RangeSlider;

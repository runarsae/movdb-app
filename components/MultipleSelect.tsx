import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Chip, useTheme} from "react-native-paper";

const styles = StyleSheet.create({
    chipContainer: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 0,
        flexWrap: "wrap"
    },
    chip: {
        marginBottom: 8,
        marginRight: 8,
        borderWidth: 0
    },
    chipText: {
        marginVertical: 0,
        paddingTop: 2
    }
});

interface Props {
    options: string[];
    onChangeSelect: (select: string[]) => void;
    value: string[];
}

function MultipleSelect(props: Props) {
    const {colors} = useTheme();

    // List of all selected elements
    const [selected, setSelected] = useState<string[]>(props.value);

    // When prop value change, update internal state
    useEffect(() => {
        setSelected(props.value);
    }, [props.value, setSelected]);

    // When internal selected state change, call on change prop
    useEffect(() => {
        props.onChangeSelect(selected);
    }, [selected]);

    // Update internal state when new values are selected
    const handleChange = (value: string) => {
        if (selected.includes(value)) {
            setSelected((prevState) => prevState.filter((select) => select !== value));
        } else {
            setSelected((prevState) => [...prevState, value]);
        }
    };

    // Render a chip for each option
    const chips = props.options.map((option) => (
        <Chip
            key={option}
            style={[styles.chip, selected.includes(option) ? {backgroundColor: colors.primary} : {}]}
            selectedColor={selected.includes(option) ? "#000000" : colors.text}
            textStyle={styles.chipText}
            onPress={() => handleChange(option)}
        >
            {option}
        </Chip>
    ));

    return (
        <ScrollView style={{flexGrow: 0}}>
            <View style={styles.chipContainer}>{chips}</View>
        </ScrollView>
    );
}

export default MultipleSelect;

import React from "react";
import {useReactiveVar} from "@apollo/client";
import {Keyboard, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {filterOpenVar, searchOpenVar, sortOpenVar} from "../Store";

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#000000",
        opacity: 0.5,
        zIndex: 1,
        height: "100%",
        width: "100%"
    }
});

function Backdrop(): JSX.Element {
    // Get open values from store to check which element is open
    const sortOpen = useReactiveVar(sortOpenVar);
    const searchOpen = useReactiveVar(searchOpenVar);
    const filterOpen = useReactiveVar(filterOpenVar);

    // Close foreground element when backdrop is clicked
    const close = () => {
        // Hide keyboard
        Keyboard.dismiss();

        if (filterOpen) {
            filterOpenVar(false);
        } else if (sortOpen) {
            sortOpenVar(false);
        } else if (searchOpen) {
            searchOpenVar(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={close}>
            <View
                style={[
                    styles.backdrop,
                    {
                        display: sortOpen || searchOpen || filterOpen ? "flex" : "none",
                        // When filter is open, backdrop should be over the header
                        zIndex: filterOpen ? 4 : 1
                    }
                ]}
            ></View>
        </TouchableWithoutFeedback>
    );
}

export default Backdrop;

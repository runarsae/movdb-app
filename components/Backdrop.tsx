import React from "react";
import {useReactiveVar} from "@apollo/client";
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {filterOpenVar, searchOpenVar, sortOpenVar} from "../Store";

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#000000",
        opacity: 0.5,
        zIndex: 9,
        height: "100%",
        width: "100%"
    }
});

function Backdrop(): JSX.Element {
    const sortOpen = useReactiveVar(sortOpenVar);
    const searchOpen = useReactiveVar(searchOpenVar);

    const close = () => {
        if (sortOpen) {
            sortOpenVar(false);
        } else if (searchOpen) {
            searchOpenVar(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={close}>
            <View style={[styles.backdrop, {display: sortOpen || searchOpen ? "flex" : "none"}]}></View>
        </TouchableWithoutFeedback>
    );
}

export default Backdrop;

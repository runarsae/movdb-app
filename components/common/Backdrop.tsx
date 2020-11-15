import React from "react";
import {useReactiveVar} from "@apollo/client";
import {Keyboard, StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import {filterOpenVar, popupOpenVar, searchOpenVar, sortOpenVar} from "../../Store";

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#000000",
        opacity: 0.6,
        zIndex: 1,
        height: "100%",
        width: "100%"
    }
});

/*
 *  A black color overlay component with opacity, used to fade out background elements.
 *  Can be clicked to close foreground elements.
 */
function Backdrop(): JSX.Element | null {
    // Get open values from store to check which element is open
    const sortOpen = useReactiveVar(sortOpenVar);
    const searchOpen = useReactiveVar(searchOpenVar);
    const filterOpen = useReactiveVar(filterOpenVar);
    const popupOpen = useReactiveVar(popupOpenVar);

    // Close foreground element when backdrop is clicked
    const close = () => {
        // Hide keyboard
        Keyboard.dismiss();

        if (popupOpen) {
            popupOpenVar(false);
        } else if (filterOpen) {
            filterOpenVar(false);
        } else if (sortOpen) {
            sortOpenVar(false);
        } else if (searchOpen) {
            searchOpenVar(false);
        }
    };

    if (sortOpen || searchOpen || filterOpen || popupOpen) {
        return (
            <TouchableWithoutFeedback onPress={close}>
                <View
                    style={[
                        styles.backdrop,
                        {
                            // When filter or movie popup is open, the backdrop is over the header
                            zIndex: filterOpen || popupOpen ? 4 : 1
                        }
                    ]}
                ></View>
            </TouchableWithoutFeedback>
        );
    } else {
        return null;
    }
}

export default Backdrop;

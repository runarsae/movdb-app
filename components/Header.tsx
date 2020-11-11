import React from "react";
import {useReactiveVar} from "@apollo/client";
import {StyleSheet, View} from "react-native";
import {Appbar, useTheme} from "react-native-paper";
import Search from "./Search";
import Sort from "./Sort";
import {filterOpenVar, searchOpenVar, sortOpenVar} from "../Store";

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#252525",
        zIndex: 3
    }
});

function Header(): JSX.Element {
    const {colors} = useTheme();

    const searchOpen = useReactiveVar(searchOpenVar);

    const sortOpen = useReactiveVar(sortOpenVar);

    // Open filter menu
    const toggleFilter = () => {
        filterOpenVar(true);
    };

    const toggleSort = () => {
        // Check if sort bar is closed or not
        if (!sortOpen) {
            // Open sort bar and close search bar if it is open
            sortOpenVar(true);
            if (searchOpen) {
                searchOpenVar(false);
            }
        } else {
            // Close sort bar
            sortOpenVar(false);
        }
    };

    const toggleSearch = () => {
        // Check if search bar is closed or not
        if (!searchOpen) {
            // Open search bar and close sort bar if it is open
            searchOpenVar(true);
            if (sortOpen) {
                sortOpenVar(false);
            }
        } else {
            // Close search bar
            searchOpenVar(false);
        }
    };

    return (
        <View style={{zIndex: 3}}>
            <Appbar.Header style={styles.navbar}>
                <Appbar.Content title="MovDB" color={colors.primary} />
                <Appbar.Action icon="magnify" color={colors.primary} onPress={toggleSearch} />
                <Appbar.Action icon="swap-vertical" color={colors.primary} onPress={toggleSort} />
                <Appbar.Action icon="dots-vertical" color={colors.primary} onPress={toggleFilter} />
            </Appbar.Header>

            <Search />

            <Sort />
        </View>
    );
}

export default Header;

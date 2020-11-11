import React from "react";
import {useReactiveVar} from "@apollo/client";
import {Appbar, useTheme} from "react-native-paper";
import {filterOpenVar, searchOpenVar, sortOpenVar} from "../../Store";

function Header(): JSX.Element {
    const {colors} = useTheme();

    const searchOpen = useReactiveVar(searchOpenVar);

    const sortOpen = useReactiveVar(sortOpenVar);

    // Open filter menu and close search/sort bar if open
    const toggleFilter = () => {
        filterOpenVar(true);
        searchOpenVar(false);
        sortOpenVar(false);
    };

    const toggleSort = () => {
        // Check if sort bar is closed or not
        if (!sortOpen) {
            // Open sort bar and close search bar if it is open
            sortOpenVar(true);
            searchOpenVar(false);
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
            sortOpenVar(false);
        } else {
            // Close search bar
            searchOpenVar(false);
        }
    };

    return (
        <Appbar.Header style={{zIndex: 3, backgroundColor: colors.surface}}>
            <Appbar.Content title="MovDB" color={colors.primary} />
            <Appbar.Action icon="magnify" color={colors.primary} onPress={toggleSearch} />
            <Appbar.Action icon="swap-vertical" color={colors.primary} onPress={toggleSort} />
            <Appbar.Action icon="dots-vertical" color={colors.primary} onPress={toggleFilter} />
        </Appbar.Header>
    );
}

export default Header;

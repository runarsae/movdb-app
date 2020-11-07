import React, {useEffect, useRef, useState} from "react";
import {useReactiveVar} from "@apollo/client";
import {StyleSheet, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData} from "react-native";
import {Avatar, Surface, useTheme} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import {searchVar, searchOpenVar} from "../Store";

const styles = StyleSheet.create({
    subbar: {
        position: "absolute",
        width: "100%",
        zIndex: 9
    },
    container: {
        padding: 16,
        width: "100%"
    },
    searchContainer: {
        width: "100%"
    },
    input: {
        width: "100%",
        height: 36,
        fontSize: 16,
        backgroundColor: "#383838",
        borderRadius: 4,
        paddingLeft: 44,
        paddingRight: 12
    },
    searchIcon: {
        backgroundColor: "transparent",
        padding: 0,
        position: "absolute",
        left: 6,
        top: 2,
        zIndex: 1
    }
});

function Search(): JSX.Element {
    const {colors} = useTheme();

    const [searchText, setSearchText] = useState<string>("");

    // Height of search bar
    const [searchHeight, setSearchHeight] = useState<number>(68);

    const searchOpen = useReactiveVar(searchOpenVar);

    // Reference to search field
    const searchRef = useRef<TextInput | null>(null);

    useEffect(() => {
        if (searchRef && searchRef.current) {
            if (searchOpen) {
                // Focus search field on open
                searchRef.current.focus();
            } else {
                // Blur search field on close
                searchRef.current.blur();
            }
        }
    }, [searchOpen]);

    // On submit, save search text to store and close search bar
    const handleSubmit = () => {
        searchVar(searchText);
        searchOpenVar(false);
    };

    // On enter key press, submit search
    const handleKeyDown = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key == "Enter") {
            handleSubmit();
        }
    };

    return (
        <Animatable.View
            transition={"bottom"}
            duration={250}
            style={[
                styles.subbar,
                {
                    // Calculate where to place search bar according to its height
                    bottom: searchOpen ? -searchHeight : 10
                }
            ]}
            onLayout={(event) => {
                // Get height of search bar
                var {height} = event.nativeEvent.layout;
                if (height !== searchHeight) {
                    setSearchHeight(height);
                }
            }}
        >
            <Surface style={styles.container}>
                <View style={styles.searchContainer}>
                    <Avatar.Icon icon="magnify" style={styles.searchIcon} size={32} color={colors.placeholder} />

                    <TextInput
                        ref={searchRef}
                        style={[styles.input, {color: colors.text}]}
                        selectionColor={colors.primary}
                        placeholder="Search"
                        onChangeText={(text) => setSearchText(text)}
                        value={searchText}
                        onSubmitEditing={handleSubmit}
                        onKeyPress={handleKeyDown}
                        blurOnSubmit
                    />
                </View>
            </Surface>
        </Animatable.View>
    );
}

export default Search;

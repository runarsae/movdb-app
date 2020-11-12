import React, {useEffect, useRef, useState} from "react";
import {useReactiveVar} from "@apollo/client";
import {StyleSheet, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData} from "react-native";
import {Avatar, IconButton, Surface, useTheme} from "react-native-paper";
import * as Animatable from "react-native-animatable";
import {searchVar, searchOpenVar} from "../../Store";
import {getStatusBarHeight} from "react-native-status-bar-height";

const styles = StyleSheet.create({
    subbar: {
        position: "absolute",
        width: "100%",
        right: 0,
        zIndex: 2
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
        paddingRight: 34
    },
    searchIcon: {
        backgroundColor: "transparent",
        padding: 0,
        position: "absolute",
        left: 6,
        top: 2,
        zIndex: 1
    },
    clearIcon: {
        position: "absolute",
        right: 0,
        top: 0,
        height: 24,
        width: 24,
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
            transition={"top"}
            duration={250}
            style={[
                styles.subbar,
                {
                    // Calculate where to place search bar according to its height
                    top: searchOpen ? 56 + getStatusBarHeight() : -searchHeight
                }
            ]}
            onLayout={(event) => {
                // Get height of search bar
                const {height} = event.nativeEvent.layout;
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
                        placeholderTextColor={colors.placeholder}
                        onChangeText={(text) => setSearchText(text)}
                        value={searchText}
                        onSubmitEditing={handleSubmit}
                        onKeyPress={handleKeyDown}
                        blurOnSubmit
                    />
                    {searchText.length > 0 && (
                        <IconButton
                            icon="close"
                            size={18}
                            color={colors.text}
                            style={styles.clearIcon}
                            onPress={() => setSearchText("")}
                        />
                    )}
                </View>
            </Surface>
        </Animatable.View>
    );
}

export default Search;

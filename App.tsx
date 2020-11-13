import React from "react";
import {StyleSheet, View} from "react-native";
import {DefaultTheme, Provider as ThemeProvider} from "react-native-paper";
import {ApolloClient, ApolloProvider, NormalizedCacheObject} from "@apollo/client";
import {cache} from "./Store";
import Header from "./components/header/Header";
import Backdrop from "./components/common/Backdrop";
import Filter from "./components/filter/Filter";
import MovieContainer from "./components/moviecontainer/MovieContainer";
import MoviePopup from "./components/moviepopup/MoviePopup";
import Search from "./components/search/Search";
import Sort from "./components/sort/Sort";

const styles = StyleSheet.create({
    // Root element styling
    wrapper: {
        backgroundColor: "#111010",
        width: "100%",
        height: 0,
        overflow: "hidden",
        flex: 1
    }
});

// Theme settings for all components in the application
const theme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        primary: "#ffc045",
        accent: "#E5E7E9",
        surface: "#252525",
        placeholder: "#6C6C6C",
        text: "#C2C2C2"
    }
};

// Connection to backend and cache (local state management)
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    uri: "http://it2810-23.idi.ntnu.no:3000/",
    cache: cache
});

export default function App(): JSX.Element {
    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <View style={styles.wrapper}>
                    <Header />
                    <Search />
                    <Sort />
                    <Filter />
                    <MovieContainer />
                    <MoviePopup />
                    <Backdrop />
                </View>
            </ThemeProvider>
        </ApolloProvider>
    );
}

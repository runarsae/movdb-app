import React from "react";
import {StyleSheet, View, Platform} from "react-native";
import {DefaultTheme, Provider as ThemeProvider} from "react-native-paper";
import {ApolloClient, ApolloProvider, NormalizedCacheObject} from "@apollo/client";
import {cache} from "./Store";
import Header from "./components/Header";
import Backdrop from "./components/Backdrop";
import Filter from "./components/Filter";
import MovieContainer from "./components/MovieContainer";

// Remove outline of input elements and style scroll bars on web
const injectWebCss = () => {
    if (Platform.OS === "web") {
        const style = document.createElement("style");
        style.textContent = `
            textarea, select, input, button {
                outline: none !important;
            }
            
            ::-webkit-scrollbar {
                width: 6px;
                height: 4px;
            }

            ::-webkit-scrollbar-track {
                background-color: transparent;
            }

            ::-webkit-scrollbar-thumb {
                background-color: #505050;
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background-color: #3D3D3D;
            }
            
        `;

        return document.head.append(style);
    }
};

injectWebCss();

// Root element styling
const styles = StyleSheet.create({
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

export default function App() {
    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <View style={styles.wrapper}>
                    <Header />
                    <Filter />
                    <MovieContainer />
                    <Backdrop />
                </View>
            </ThemeProvider>
        </ApolloProvider>
    );
}

import React from "react";
import {StyleSheet, View, Platform} from "react-native";
import {DefaultTheme, Provider as ThemeProvider} from "react-native-paper";
import {ApolloClient, ApolloProvider, NormalizedCacheObject} from "@apollo/client";
import {cache} from "./Store";
import Header from "./components/Header";
import Backdrop from "./components/Backdrop";

// Remove outline of input elements on web
const injectWebCss = () => {
    if (Platform.OS === "web") {
        const style = document.createElement("style");
        style.textContent = `textarea, select, input, button {outline: none !important;}`;
        return document.head.append(style);
    }
};

injectWebCss();

// Root element styling
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "green", //"#111010",
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

                    <Backdrop />
                </View>
            </ThemeProvider>
        </ApolloProvider>
    );
}

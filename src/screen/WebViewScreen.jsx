// WebViewScreen.jsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';


const WebViewScreen = () => {
    const route = useRoute();
    const { latitude, longitude } = route.params || {};

    const uri = latitude && longitude
        ? `https://www.google.com/maps/search/restaurants/@${latitude},${longitude},15z`
        : 'https://www.google.com/maps/search/restaurants+near+me';

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri }}
                style={{ flex: 1 }}
                originWhitelist={['*']}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default WebViewScreen;

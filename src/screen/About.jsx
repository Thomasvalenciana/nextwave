import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTab from './BottomTab'
import Feather from 'react-native-vector-icons/Feather';

const AboutPage = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={require('../assets/social1.png')} style={styles.logo} />

                <Text style={styles.title}>About Social Foodies</Text>
                <Text style={styles.paragraph}>
                    Social Foodies is your go-to app for connecting with fellow food lovers near you. Whether
                    you're new in town, looking for a food buddy, or just want to explore restaurants around you.
                    We've got you.
                </Text>

                <Text style={styles.paragraph}>
                    This app helps you discover nearby restaurants, match with users who share your food
                    preferences, and track your foodie adventures. Earn rewards, leave reviews, and most
                    importantly make memories over meals.
                </Text>

                <Text style={styles.sectionTitle}>Technologies Used</Text>
                <View style={styles.listItem}>
                    <Feather name="map-pin" size={18} color="#B40324" />
                    <Text style={styles.listText}> Google Places & Maps API</Text>
                </View>
                <View style={styles.listItem}>
                    <Feather name="database" size={18} color="#B40324" />
                    <Text style={styles.listText}> Firebase for Authentication & Storage</Text>
                </View>
                <View style={styles.listItem}>
                    <Feather name="smartphone" size={18} color="#B40324" />
                    <Text style={styles.listText}> Built with React Native & Expo</Text>
                </View>

                <Text style={styles.footer}>Made with ❤️ 😉 by the Social Foodies Team</Text>
            </ScrollView>

            {/* ⬇️ Your custom bottom tab bar */}
            <BottomTab />
        </SafeAreaView>
    );
};

export default AboutPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CFAFA6',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // ⬅️ makes space for the bottom tab
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#B40324',
        marginBottom: 10,
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 15,
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#B40324',
        marginTop: 20,
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    listText: {
        fontSize: 16,
        color: '#333',
    },
    footer: {
        fontSize: 14,
        marginTop: 30,
        color: '#555',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';

const BottomTab = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const getTabStyle = (tabName) => [
        styles.tabItem,
        route.name === tabName && styles.activeTabItem,
    ];

    const getIconColor = (tabName) => (route.name === tabName ? '#7a0013' : '#B40324');
    const getLabelStyle = (tabName) => [
        styles.tabLabel,
        route.name === tabName && styles.activeTabLabel,
    ];

    return (
        <View style={styles.bottomTab}>
            <TouchableOpacity style={getTabStyle('MainPage')} onPress={() => navigation.navigate('MainPage')}>
                <Feather name="home" size={28} color={getIconColor('MainPage')} />
                <Text style={getLabelStyle('MainPage')}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('Rewards')} onPress={() => navigation.navigate('Rewards')}>
                <Feather name="gift" size={28} color={getIconColor('Rewards')} />
                <Text style={getLabelStyle('Rewards')}>Rewards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('Matches')} onPress={() => navigation.navigate('Matches')}>
                <Feather name="heart" size={28} color={getIconColor('Matches')} />
                <Text style={getLabelStyle('Matches')}>Matches</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('Inbox')} onPress={() => navigation.navigate('Inbox')}>
                <Feather name="message-square" size={28} color={getIconColor('Inbox')} />
                <Text style={getLabelStyle('Inbox')}>Inbox</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getTabStyle('Bio')} onPress={() => navigation.navigate('Bio')}>
                <Feather name="user" size={28} color={getIconColor('Bio')} />
                <Text style={getLabelStyle('Bio')}>Me</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomTab: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingBottom: 25,
        borderTopWidth: 1,
        borderColor: '#B40324',
        backgroundColor: '#CFAFA6',
    },
    tabItem: {
        alignItems: 'center',
        padding: 5,
        borderRadius: 10,
    },
    activeTabItem: {
        backgroundColor: '#EBD8D2',
    },
    tabLabel: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
    },
    activeTabLabel: {
        fontWeight: 'bold',
        color: '#7a0013',
    },
});

export default BottomTab;

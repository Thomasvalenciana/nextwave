import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';


const mockFriends = [
    {
        id: '1',
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        avatar: require('../assets/new_profile.png'),
    },
    {
        id: '2',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: require('../assets/pic1.png'),
    },
    {
        id: '3',
        name: 'Lisa Wong',
        email: 'lisa@example.com',
        avatar: require('../assets/social1.png'),
    },
];



const Friends = () => {
    const [friends, setFriends] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        //firebase would go here once we have this part connected 
        setFriends(mockFriends);
    }, []);

    const renderFriend = ({ item }) => (
        <View style={styles.card}>
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
            </View>
        </View>
    );
    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.header}>Foodie Friends</Text>

            <FlatList
                data={friends}
                keyExtractor={item => item.id}
                renderItem={renderFriend}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CFAFA6',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 14,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    backButton: {
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Friends;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from "../utils/colors";
import { fonts } from '../utils/fonts';




const NewGroupScreen = ({ navigation }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [autoGroupName, setAutoGroupName] = useState('');


    // Mock friends list and existing groups
    const friends = [
        { id: '1', name: 'Diana Rios' },
        { id: '2', name: 'Thomas Valenciana' },
        { id: '3', name: 'Michael T' },
        { id: '4', name: 'Sarah K.' },
    ];




    // Mock existing groups - replace with your actual data
    const [existingGroups] = useState([
        { id: 'group1', name: 'Foodie Squad', members: ['1', '3'] },
        { id: 'group2', name: 'Work Friends', members: ['2', '4'] }
    ]);




    useEffect(() => {
        if (selectedFriends.length > 0) {
            const selectedNames = friends
                .filter(friend => selectedFriends.includes(friend.id))
                .map(friend => friend.name);
            setAutoGroupName(selectedNames.join(', '));
        } else {
            setAutoGroupName('');
        }
    }, [selectedFriends]);




    const toggleFriendSelection = (friendId) => {
        setSelectedFriends(prev =>
            prev.includes(friendId)
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
    };




    const createGroup = () => {
        if (selectedFriends.length === 0) return;




        const finalGroupName = groupName.trim() || autoGroupName;


        // Check for existing group with same members
        const isDuplicateGroup = existingGroups.some(group => {
            const sameMembers = group.members.length === selectedFriends.length &&
                group.members.every(member => selectedFriends.includes(member));
            return sameMembers;
        });




        if (isDuplicateGroup) {
            Alert.alert(
                'Group Exists',
                'You already have a group with these members',
                [{ text: 'OK' }]
            );
        } else {
            // Create the group object with all required fields
            const newGroup = {
                id: `group-${Date.now()}`, // Generate unique ID
                name: finalGroupName,
                lastMessage: 'Group created', // Initial message
                time: 'Just now',
                unread: false,
                members: selectedFriends.length,
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg' // Default group avatar
            };




            // Navigate to GroupChat with the complete group object
            navigation.navigate('GroupChat', {
                group: newGroup
            });
        }
    };




    return (
        <View style={styles.container}>
            {/* Header remains the same */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={24} color={colors.deepRed} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Group</Text>
                <TouchableOpacity
                    onPress={createGroup}
                    disabled={selectedFriends.length === 0}
                >
                    <Text style={[
                        styles.createButton,
                        selectedFriends.length === 0 && styles.disabledButton
                    ]}>
                        Create
                    </Text>
                </TouchableOpacity>
            </View>




            {/* Group Name Input remains the same */}
            <View style={styles.nameContainer}>
                <TextInput
                    style={styles.groupNameInput}
                    placeholder={autoGroupName || "Group Name (Optional)"}
                    placeholderTextColor={groupName ? '#333' : '#999'}
                    value={groupName}
                    onChangeText={setGroupName}
                />
                {!groupName && autoGroupName && (
                    <Text style={styles.autoNameHint}>Will display as: {autoGroupName}</Text>
                )}
            </View>




            {/* Friends List remains the same */}
            <Text style={styles.sectionTitle}>Select Foodie Friends</Text>
            {friends.length > 0 ? (
                <FlatList
                    data={friends}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.friendItem,
                                selectedFriends.includes(item.id) && styles.selectedFriendItem
                            ]}
                            onPress={() => toggleFriendSelection(item.id)}
                        >
                            <Text style={styles.friendName}>{item.name}</Text>
                            {selectedFriends.includes(item.id) && (
                                <Feather name="check-circle" size={20} color={colors.deepRed} />
                            )}
                        </TouchableOpacity>
                    )}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Feather name="users" size={50} color={colors.darkAccent} />
                    <Text style={styles.emptyText}>No friends available</Text>
                    <Text style={styles.emptySubtext}>Connect with more foodies to create groups</Text>
                </View>
            )}
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.softPink,
        paddingTop: 45,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.deepRed,
    },
    createButton: {
        color: colors.deepRed,
        fontWeight: 'bold',
    },
    disabledButton: {
        color: '#ccc',
    },
    nameContainer: {
        marginHorizontal: 20,
        marginVertical: 15,
    },
    groupNameInput: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.deepRed,
        fontSize: 16,
    },
    autoNameHint: {
        fontFamily: fonts.Regular,
        color: '#666',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    sectionTitle: {
        fontFamily: 'HelveticaNeue-Bold',
        fontSize: 16,
        color: colors.darkAccent,
        marginLeft: 20,
        marginBottom: 10,
    },
    friendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
    selectedFriendItem: {
        backgroundColor: '#FFF0F0',
    },
    friendName: {
        fontFamily: fonts.Medium,
        fontSize: 16,
        color: colors.darkAccent,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontFamily: fonts.Medium,
        fontSize: 18,
        color: colors.darkAccent,
        marginTop: 15,
    },
    emptySubtext: {
        fontFamily: fonts.Regular,
        color: colors.darkAccent,
        textAlign: 'center',
        marginTop: 5,
    },
});




export default NewGroupScreen;
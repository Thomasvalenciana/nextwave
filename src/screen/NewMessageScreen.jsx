import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';




const NewMessageScreen = ({ route, navigation }) => {
  const matches = route.params?.matches || [
    // Default matches
    {
      id: '1',
      name: 'Diana Rios',
      profilePhoto: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '2',
      name: 'Thomas Valenciana',
      profilePhoto: 'https://randomuser.me/api/portraits/men/36.jpg'
    },
    {
      id: '3',
      name: 'Sarah K.',
      profilePhoto: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: '4',
      name: 'Michael T.',
      profilePhoto: 'https://randomuser.me/api/portraits/men/75.jpg'
    }
  ];


  const [searchQuery, setSearchQuery] = useState('');


  // Mock existing conversations - replace with your actual data
  const [conversations] = useState([
    {
      id: 'conv1',
      participants: [{ id: '1', name: 'Diana Rios' }],
      lastMessage: "Hey there!"
    },
    {
      id: 'conv2',
      participants: [{ id: '2', name: 'Thomas Valenciana' }],
      lastMessage: "Let’s try that new ramen spot."
    }
  ]);




  const filteredMatches = matches.filter(match =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase())
  );




  const handleRecipientSelect = (recipient) => {
    // Check for existing conversation
    const existingConvo = conversations.find(conv =>
      conv.participants.some(p => p.id === recipient.id)
    );




    if (existingConvo) {
      navigation.navigate('Chat', {
        chat: {
          id: existingConvo.id,
          name: recipient.name,
          avatar: recipient.profilePhoto,
          lastMessage: existingConvo.lastMessage,
          time: 'Just now',
          unread: false,
          isGroup: false
        },
        isExisting: true
      });
    } else {
      navigation.navigate('Chat', {
        chat: {
          id: `new_${recipient.id}`,
          name: recipient.name,
          avatar: recipient.profilePhoto,
          lastMessage: '',
          time: '',
          unread: false,
          isGroup: false
        },
        isExisting: false
      });
    }
  };




  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color={colors.deepRed} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={styles.headerSpacer} />
      </View>




      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBarWithIcon}
          placeholder="Search matches..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>


      {/* Matches List */}
      <FlatList
        data={filteredMatches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.matchItem}
            onPress={() => handleRecipientSelect(item)}
          >
            <Image
              source={{ uri: item.profilePhoto }}
              style={styles.matchPhoto}
            />
            <View style={styles.matchTextContainer}>
              <Text style={styles.matchName}>{item.name}</Text>
              {/* Show "Existing chat" indicator if applicable */}
              {conversations.some(conv =>
                conv.participants.some(p => p.id === item.id)) && (
                  <Text style={styles.existingChatText}>Existing chat</Text>
                )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <View style={styles.noMatchesContainer}>
            <Text style={styles.noMatchesText}>
              No matches found for "{searchQuery}"
            </Text>
          </View>
        }
      />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softPink,
    paddingTop: 39,
  },
  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: colors.softPink,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepRed,
    fontFamily: 'HelveticaNeue-Bold',
  },
  backButton: {
    padding: 5,
  },
  headerSpacer: {
    width: 24,
  },
  // Search Styles
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    borderColor: '#B40324',
    borderWidth: 1.5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBarWithIcon: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  // Content Styles
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMatchesText: {
    fontFamily: 'HelveticaNeue',
    color: colors.darkAccent,
    textAlign: 'center',
    marginTop: 20,
  },
  listContentContainer: {
    paddingHorizontal: 20,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  matchPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  matchTextContainer: {
    flex: 1,
  },
  matchName: {
    fontFamily: 'HelveticaNeue',
    fontSize: 16,
    color: colors.darkAccent,
  },
  existingChatText: {
    fontFamily: fonts.Regular,
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});




export default NewMessageScreen;
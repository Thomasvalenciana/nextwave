import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, ScrollView, StatusBar, Modal, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../utils/colors';
import BottomTab from './BottomTab';








const Inbox = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);




  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'Diana',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      lastMessage: 'Diana: Hey, are you free to grab lunch?',
      time: '2:45 PM',
      unread: true,
      isGroup: false
    },
    {
      id: '2',
      name: 'Thomas',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      lastMessage: 'Thomas: Let’s try that new ramen spot.',
      time: '1:10 PM',
      unread: false,
      isGroup: false
    },
  ]);




  const [groups] = useState([
    {
      id: 'g1',
      name: 'Foodie Squad',
      lastMessage: 'Sarah K.: Let\'s try the new ramen spot',
      time: '3d ago',
      unread: false,
      members: 4,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  ]);




  // handle markAsRead parameter
  const updateChatLastMessage = (chatId, newMsgText, markAsRead = false) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? {
            ...chat,
            lastMessage: newMsgText.startsWith('You:') ? newMsgText : `You: ${newMsgText}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: markAsRead ? false : chat.unread // Only update if markAsRead is true
          }
          : chat
      )
    );
  };




  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );




  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );




  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.darkAccent} />


      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inbox</Text>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.newMessageButton}
          >
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>




      <ScrollView style={styles.content}>
        <View style={styles.searchWrapper}>
          <Feather name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBarWithIcon}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>




        {/* Foodie Matches */}
        <Text style={styles.sectionTitle}>Your Foodie Matches</Text>
        <View style={styles.matchesContainer}>
          <TouchableOpacity style={styles.matchItem}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }}
              style={styles.matchAvatar}
            />
            <Text style={styles.matchName}>Sarah K.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.matchItem}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/75.jpg' }}
              style={styles.matchAvatar}
            />
            <Text style={styles.matchName}>Michael T.</Text>
          </TouchableOpacity>
        </View>




        {/* Groups */}
        <Text style={styles.sectionTitle}>Groups</Text>
        {filteredGroups.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No groups yet</Text>
          </View>
        ) : (
          <FlatList
            data={filteredGroups}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => navigation.navigate('Chat', {
                  chat: {
                    ...item,
                    isGroup: false,
                    initialMessage: item.lastMessage.startsWith(`${item.name}:`)
                      ? item.lastMessage.replace(`${item.name}: `, '')
                      : item.lastMessage
                  },
                  onUpdateLastMessage: (newMsg, markAsRead) =>
                    updateChatLastMessage(item.id, newMsg, markAsRead)
                })}
              >
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.conversationDetails}>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  <Text
                    style={[
                      styles.lastMessage,
                      item.unread && styles.unreadMessage // This applies bold styling
                    ]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  {item.unread && <View style={styles.unreadBadge} />}
                </View>
              </TouchableOpacity>
            )}
          />
        )}




        {/* Messages */}
        <Text style={styles.sectionTitle}>Messages</Text>
        {filteredChats.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>No messages yet</Text>
          </View>
        ) : (
          <FlatList
            data={filteredChats}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => navigation.navigate('Chat', {
                  chat: {
                    ...item,
                    isGroup: false,
                    initialMessage: item.lastMessage.startsWith(`${item.name}:`)
                      ? item.lastMessage.replace(`${item.name}: `, '')
                      : item.lastMessage
                  },
                  onUpdateLastMessage: (newMsg, markAsRead) =>
                    updateChatLastMessage(item.id, newMsg, markAsRead)
                })}
              >
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.conversationDetails}>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  <Text
                    style={[
                      styles.lastMessage,
                      item.unread && styles.unreadMessage // This applies bold styling
                    ]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  {item.unread && <View style={styles.unreadBadge} />}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>




      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.bottomModalContainer}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsModalVisible(false);
                navigation.navigate('NewMessage');
              }}
            >
              <Text style={styles.modalOptionText}>New Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setIsModalVisible(false);
                navigation.navigate('NewGroup');
              }}
            >
              <Text style={styles.modalOptionText}>New Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>




      <BottomTab />
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 39,
    backgroundColor: colors.softPink,
  },
  headerContainer: {
    backgroundColor: colors.softPink,
    paddingTop: StatusBar.currentHeight,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    backgroundColor: colors.softPink,
    paddingBottom: 70,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
    fontFamily: 'HelveticaNeue-Bold',
    color: '#B40324',
    marginBottom: 0,
  },
  newMessageButton: {
    backgroundColor: colors.deepRed,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    marginVertical: 15,
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
  sectionTitle: {
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 18,
    color: colors.darkAccent,
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  placeholderContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  placeholderText: {
    fontFamily: 'HelveticaNeue',
    color: colors.darkAccent,
    textAlign: 'center',
  },
  // Conversation item styles
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationDetails: {
    flex: 1,
  },
  conversationName: {
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 16,
    color: colors.darkAccent,
    marginBottom: 3,
  },
  lastMessage: {
    fontFamily: 'HelveticaNeue',
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    color: colors.darkAccent,
    fontWeight: 'bold',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontFamily: 'HelveticaNeue',
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.deepRed,
  },
  // Matches section
  matchesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  matchItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  matchAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.deepRed,
  },
  matchName: {
    fontFamily: 'HelveticaNeue',
    fontSize: 14,
    color: colors.darkAccent,
    marginTop: 5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 20,
  },
  modalOption: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.darkAccent,
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.deepRed,
    fontWeight: '600',
    fontSize: 16,
  },
});




export default Inbox;
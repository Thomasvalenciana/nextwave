import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform // Make sure this is imported
} from 'react-native';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '/workspaces/Social-Foodies/src/utils/colors.js';


const GroupChatScreen = ({ route, navigation }) => {
  const { group } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);


  useEffect(() => {
    navigation.setOptions({ title: group.name });


    const messagesRef = collection(db, 'groups', group.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));


    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isYou: doc.data().senderId === auth.currentUser?.uid,
        time: doc.data().timestamp?.toDate().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }) || 'Just now'
      }));
      setMessages(fetchedMessages);
    });


    return () => unsubscribe();
  }, [group.id]);


  const handleSend = async () => {
    if (!newMessage.trim()) return;


    try {
      await addDoc(collection(db, 'groups', group.id, 'messages'), {
        text: newMessage,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || 'You',
        timestamp: new Date()
      });


      await updateDoc(doc(db, 'groups', group.id), {
        lastMessage: `${auth.currentUser.displayName || 'You'}: ${newMessage}`,
        lastMessageTime: new Date()
      });


      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.deepRed} />
        </TouchableOpacity>
        <Image source={{ uri: group.avatar || 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.headerAvatar} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{group.name}</Text>
          <Text style={styles.headerSubtitle}>{group.members?.length || 0} members</Text>
        </View>
      </View>


      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.isYou ? styles.yourMessage : styles.theirMessage
          ]}>
            {!item.isYou && (
              <Text style={styles.senderName}>{item.senderName}</Text>
            )}
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
      />


      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!newMessage.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={newMessage.trim() ? '#fff' : '#ccc'}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softPink,
    paddingTop: 39,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.softPink,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepRed,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10
  },
  headerText: {
    flex: 1
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888'
  },
  messagesContainer: {
    padding: 15
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  yourMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.deepRed,
    marginLeft: '20%'
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    marginRight: '20%',
    borderWidth: 1,
    borderColor: '#eee'
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 12
  },
  messageText: {
    fontSize: 16,
    color: '#000'
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    textAlign: 'right'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 20, // Add this for bottom padding
    backgroundColor: colors.softPink,
    borderTopWidth: 1,
    borderTopColor: colors.softPink,
    position: 'absolute', // Add this
    bottom: 0, // Add this
    left: 0, // Add this
    right: 0, // Add this
    marginBottom: 34, // Adjust this value to raise it up (increase to raise more)
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.deepRed,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.deepRed,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


export default GroupChatScreen;
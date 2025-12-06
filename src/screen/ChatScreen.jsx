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
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from "../utils/colors";
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';




const ChatScreen = ({ route }) => {
  // Extract params and initialize navigation
  const { chat, onUpdateLastMessage } = route.params;
  const navigation = useNavigation();


  // State management
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);


  // Initialize messages with the last message from inbox if it exists
  const [messages, setMessages] = useState(() => {
    if (chat.lastMessage && !chat.lastMessage.startsWith('You:')) {
      return [{
        id: 'initial-msg',
        text: chat.lastMessage.replace(`${chat.name}: `, ''),
        sender: chat.name,
        time: chat.time,
        isYou: false
      }];
    }
    return [];
  });




  // Mark messages as read when chat is opened (with 1s delay)
  useEffect(() => {
    const markAsReadTimer = setTimeout(() => {
      if (chat.unread && onUpdateLastMessage) {
        onUpdateLastMessage(chat.lastMessage, true);
      }
    }, 1000);




    return () => clearTimeout(markAsReadTimer);
  }, [chat.unread]);




  // Load messages from Firestore in real-time
  useEffect(() => {
    const messagesRef = collection(db, 'chats', chat.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));




    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isYou: doc.data().senderId === getAuth().currentUser.uid,
          time: doc.data().timestamp?.toDate().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }) || 'Just now'
        }));
        setMessages(fetchedMessages);
      }
    });




    return () => unsubscribe();
  }, [chat.id]);




  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);




  // Handle sending new messages
  const handleSend = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isYou: true
      };


      // Update local state immediately
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');


      // Update last message in inbox and mark as read
      if (onUpdateLastMessage) {
        onUpdateLastMessage(newMessage);
      }


      // Here you would save to Firestore
      console.log("Would save to Firestore:", newMsg);
    }
  };




  return (
    <View style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color='#B40324' />
        </TouchableOpacity>


        <Image source={{ uri: chat.avatar }} style={styles.headerAvatar} />


        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{chat.name}</Text>
          {chat.isGroup && (
            <Text style={styles.headerSubtitle}>{chat.members} members</Text>
          )}
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
            {/* Show sender name for group messages (except initial message) */}
            {!item.isYou && !item.id.includes('initial-msg') && chat.isGroup && (
              <Text style={styles.senderName}>{item.sender || 'User'}</Text>
            )}


            <Text style={styles.messageText}>{item.text}</Text>


            {/* Show time - use chat.time for initial message */}
            <Text style={styles.messageTime}>
              {item.id.includes('initial-msg') ? chat.time : item.time}
            </Text>
          </View>
        )}
      />




      {/* Message Input Area */}
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
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.disabledSendButton
          ]}
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
    paddingTop: 39,
    backgroundColor: colors.softPink,
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
  disabledSendButton: {
    backgroundColor: '#ccc',
  },
  messagesContainer: {
    padding: 15
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
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
    fontSize: 16
  },
  messageTime: {
    fontSize: 10,
    color: '#F5B5B5',
    marginTop: 4,
    textAlign: 'right'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 20,
    backgroundColor: colors.softPink,
    borderTopWidth: 1,
    borderTopColor: colors.softPink,
    marginBottom: 34,
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




export default ChatScreen;
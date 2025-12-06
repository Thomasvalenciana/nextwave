import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomTab from './BottomTab';

const ContactSupport = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleSend = () => {
    if (!subject || !message) {
      Alert.alert('Please fill out both fields.');
      return;
    }
    Alert.alert('Message sent successfully!');
    setSubject('');
    setMessage('');
  };

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Contact Support</Text>
          <Text style={styles.subtitle}>
            Need help? Reach out to us below and we'll get back to you ASAP.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />

          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Your message..."
            multiline
            numberOfLines={5}
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.button} onPress={handleSend}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* This ensures your custom tab stays pinned to the bottom */}
      <View style={styles.bottomTab}>
        <BottomTab />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#DBB6A7',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B40324',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#B40324',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  messageInput: {
    height: 110,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#B40324',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ContactSupport;

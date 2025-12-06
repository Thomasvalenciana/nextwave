// Logout.jsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function Logout() {
  const navigation = useNavigation();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await signOut(auth);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], // ✅ Make sure this matches your login screen name
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    logoutUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging you out...</Text>
      <ActivityIndicator size="large" color="#B40324" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
  },
});

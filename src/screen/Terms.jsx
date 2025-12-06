import React from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const Terms = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.date}>Effective Date: September 1, 2024</Text>

        <Text style={styles.text}>
          Welcome to Social Foodies, a mobile application that helps people connect over food experiences. These Terms and Conditions (“Terms”) govern your use of the Social Foodies app provided by Los Tragones (“us”).
        </Text>

        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By using the App, you agree to these Terms. If you do not agree, please do not use the App.
        </Text>

        <Text style={styles.heading}>2. Eligibility</Text>
        <Text style={styles.text}>
          You must be at least 18 years old to use Social Foodies. By using the App, you confirm you meet this requirement.
        </Text>

        <Text style={styles.heading}>3. Account Registration</Text>
        <Text style={styles.text}>
          You are responsible for maintaining the confidentiality of your account information. You agree to provide accurate and up-to-date information.
        </Text>

        <Text style={styles.heading}>4. Use of the App</Text>
        <Text style={styles.text}>
          You agree to use Social Foodies only for lawful purposes, including:
          {"\n"}- Connecting with others for food-related experiences
          {"\n"}- Respecting other users
          {"\n"}- Not using the app for harassment, spamming, or illegal activity
        </Text>

        <Text style={styles.heading}>5. Content</Text>
        <Text style={styles.text}>
          You may share images, bios, reviews, and food preferences (“Content”). By posting, you grant us a non-exclusive, royalty-free license to display and distribute your Content within the app. You retain ownership of your Content.
        </Text>

        <Text style={styles.heading}>6. Privacy</Text>
        <Text style={styles.text}>
          Your privacy is important to us. Please refer to our Privacy Policy to learn how we collect and use your data.
        </Text>

        <Text style={styles.heading}>7. Termination</Text>
        <Text style={styles.text}>
          We may suspend or terminate your access to Social Foodies if you violate these Terms.
        </Text>

        <Text style={styles.heading}>8. Disclaimer</Text>
        <Text style={styles.text}>
          Social Foodies is provided “as is.” We do not guarantee that matches or connections will result in successful food experiences.
        </Text>

        <Text style={styles.heading}>9. Limitation of Liability</Text>
        <Text style={styles.text}>
          We are not liable for any direct, indirect, or incidental damages resulting from your use of the App.
        </Text>

        <Text style={styles.heading}>10. Modifications</Text>
        <Text style={styles.text}>
          We reserve the right to update these Terms at any time. Continued use of the App after changes means you accept the new Terms.
        </Text>

        <Text style={styles.heading}>11. Contact</Text>
        <Text style={styles.text}>
          For any questions, please contact us at: SocialFoodies@gmail.com
        </Text>
      </ScrollView>

      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MainPage')}>
          <Feather name="home" size={28} color="#B40324" />
          <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Rewards')}>
          <Feather name="gift" size={28} color="#B40324" />
          <Text style={styles.tabLabel}>Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Feather name="heart" size={28} color="#B40324" />
          <Text style={styles.tabLabel}>Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Feather name="message-square" size={28} color="#B40324" />
          <Text style={styles.tabLabel}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Bio')}>
          <Feather name="user" size={28} color="#B40324" />
          <Text style={styles.tabLabel}>Me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 100, // to prevent content from being blocked by bottom tab
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: '#000',
    lineHeight: 20,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: '#B40324',
    marginTop: 2,
  },
});

export default Terms;

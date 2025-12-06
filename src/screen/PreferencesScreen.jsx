import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import BottomTab from './BottomTab';

const ageGroups = ['18–24', '25–34', '35–44', '45–54', '55+'];
const genderPrefs = ['Men', 'Women', 'Everyone'];
const ageDiffPrefs = ['Same age', '±5 years', '±10 years'];

export default function PreferencesScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null);
  const [genderPreference, setGenderPreference] = useState(null);
  const [ageDiff, setAgeDiff] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (auth.currentUser) {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const snap = await getDoc(userDoc);
        if (snap.exists()) {
          const data = snap.data();
          setIsVisible(data?.visibleToOthers || false);
          setAgeGroup(data?.ageGroup || null);
          setGenderPreference(data?.genderPreference || null);
          setAgeDiff(data?.ageDiff || null);
        }
      }
    };

    fetchPreferences();
  }, []);

  const savePreference = async (key, value) => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, { [key]: value }, { merge: true });
    } catch (err) {
      console.error('Error saving preference:', err);
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const toggleSwitch = async (value) => {
    setIsVisible(value);
    await savePreference('visibleToOthers', value);
  };

  const renderOption = (options, selected, setSelected, key) => (
    <View style={styles.optionContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => {
            setSelected(option);
            savePreference(key, option);
          }}
          style={[
            styles.optionButton,
            selected === option && styles.optionSelected,
          ]}
        >
          <Text style={selected === option ? styles.optionTextSelected : styles.optionText}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 🔼 Logo + Divider */}
        <View style={styles.header}>
          <Image source={require('../assets/social1.png')} style={styles.logo} />
          <View style={styles.divider} />
        </View>

        <Text style={styles.title}>Preferences</Text>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Show my location to others:</Text>
          <Switch
            value={isVisible}
            onValueChange={toggleSwitch}
            thumbColor={isVisible ? '#B40324' : '#ccc'}
            style={{ marginLeft: 30 }}
          />

          <Text style={styles.label}>What’s your age group?</Text>
          {renderOption(ageGroups, ageGroup, setAgeGroup, 'ageGroup')}

          <Text style={styles.label}>Who are you interested in hanging out with?</Text>
          {renderOption(genderPrefs, genderPreference, setGenderPreference, 'genderPreference')}

          <Text style={styles.label}>Preferred age difference:</Text>
          {renderOption(ageDiffPrefs, ageDiff, setAgeDiff, 'ageDiff')}
        </View>
      </ScrollView>
      <BottomTab />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFAFA6',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    alignItems: 'center',
    backgroundColor: '#CFAFA6',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B40324',
    marginTop: 20,
    marginLeft: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
    color: '#333',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 20,
    marginBottom: 10,
  },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#B40324',
    borderColor: '#B40324',
  },
  optionText: {
    color: '#333',
    fontSize: 15,
  },
  optionTextSelected: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#B40324',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },

});

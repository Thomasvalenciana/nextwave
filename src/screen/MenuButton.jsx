import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function MenuButton() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu}>
        <Feather name="menu" size={30} color="#B40324" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={toggleMenu}
        >
          <View style={styles.dropdown}>
            {[
              { label: 'Preferences', action: () => navigation.navigate('PreferencesScreen') },
              { label: 'Contact Support', action: () => navigation.navigate('ContactSupport') },
              { label: 'About', action: () => navigation.navigate('About')},
              { label: 'Terms & Conditions', action: () => navigation.navigate('Terms') },/// TERMS CONDITONSSSSS JUST UPDATED            
              { label: 'Log Out', action: () => navigation.navigate('Logout'), danger: true },
              ,
            ].map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  toggleMenu();
                  item.action?.();
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                  item.danger && styles.menuItemDanger,
                ]}
              >
                <Text style={[styles.menuText, item.danger && styles.menuTextDanger]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    width: 200,
    elevation: 4,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  menuItemPressed: {
    backgroundColor: '#f3f3f3',
  },
  menuItemDanger: {
    backgroundColor: '#fff5f5',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuTextDanger: {
    color: '#B40324',
    fontWeight: '600',
  },
});

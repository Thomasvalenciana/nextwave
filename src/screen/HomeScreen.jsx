
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {

  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignup = () => {
    navigation.navigate("Sign");
  };


  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/social1.png")}
        style={styles.logo}
      />
      <Text style={styles.text}>Swipe. Meet. Eat.</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.loginButtonWrapper, { backgroundColor: colors.deepRed }]}
          onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleSignup}>
          <Text style={styles.SignUpButtonText}>Sign-Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 300,
    marginBottom: 20,
  },
  text: {
    color: colors.darkAccent,
    fontSize: 30,
    fontFamily: fonts.Bold,
    textAlign: "center",
    marginTop: 40,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 40,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.darkAccent,
    width: "90%",
    height: 70,
    borderRadius: 200,
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 98,
  },
  loginButtonText: {
    color: colors.softPink,
    fontSize: 20,
    fontFamily: fonts.Extra

  },
  SignUpButtonText: {
    color: colors.darkAccent,
    fontSize: 20,
    fontFamily: fonts.Extra

  },
});

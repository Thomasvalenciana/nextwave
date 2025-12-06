import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Platform,
  FlatList,
  ScrollView,
} from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import Feather from "react-native-vector-icons/Feather";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import BottomTab from "../screen/BottomTab";

const ProfileContext = createContext();

const sampleReviews = [
  {
    id: "1",
    name: "97 West Kitchen & Bar",
    image: require("../assets/pic1.png"),
  },
  {
    id: "2",
    name: "Farm Food Kitchen!",
    image: require("../assets/pic1.png"),
  },
  {
    id: "3",
    name: "61 Osteria",
    image: require("../assets/social1.png"),
  },
];

const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: "Foodie",
    email: "Hello.Foodie@example.com",
    bio: "This is my bio and I love trying new places, grab a bite and be friends :)",
    picture: null,
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

const updateProfileInFirestore = async (userId, profileData) => {
  try {
    await setDoc(doc(db, "users", userId), profileData);
    console.log("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile: ", error);
  }
};

// NEW: Save user reviews to Firestore
const saveReviewsToFirestore = async (userId, reviews) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, { reviews }, { merge: true });
    console.log("Reviews saved to Firestore!");
  } catch (error) {
    console.error("Error saving reviews:", error);
  }
};

// NEW: Get user reviews from Firestore
const getReviewsFromFirestore = async (userId, setReviews) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.reviews) {
        setReviews(data.reviews);
        console.log("Reviews loaded from Firestore!");
      }
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

const getProfileFromFirestore = async (
  userId,
  setProfile,
  setName,
  setEmail,
  setBio,
  setPicture
) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const profileData = docSnap.data();
      setProfile(profileData);
      setName(profileData.name);
      setEmail(profileData.email);
      setBio(profileData.bio);
      setPicture(profileData.picture);
    } else {
      console.log("No profile data found.");
    }
  } catch (error) {
    console.error("Error fetching profile: ", error);
  }
};

const Bio = () => {
  const navigation = useNavigation();
  const { profile, setProfile } = useContext(ProfileContext);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [picture, setPicture] = useState(profile.picture);
  const [reviews, setReviews] = useState(sampleReviews);

  const removeReview = async (id) => {
    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);

    const userId = auth.currentUser?.uid;
    if (userId) {
      await saveReviewsToFirestore(userId, updatedReviews); // NEW: Save updated reviews
    }
  };
  const addReview = async () => {
    Alert.prompt(
      "Add Review",
      "Enter the name of the place you want to review:",
      async (text) => {
        if (text) {
          const newReview = {
            id: Date.now().toString(),
            name: text,
            image: require("../assets/pic1.png"), // You can customize later
          };

          const updatedReviews = [...reviews, newReview];
          setReviews(updatedReviews);

          const userId = auth.currentUser?.uid;
          if (userId) {
            await saveReviewsToFirestore(userId, updatedReviews);
          }
        }
      }
    );
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need media permissions to pick an image!");
        }
      }
      const userId = auth.currentUser?.uid;
      if (userId) {
        await getProfileFromFirestore(
          userId,
          setProfile,
          setName,
          setEmail,
          setBio,
          setPicture
        );
        await getReviewsFromFirestore(userId, setReviews); // NEW: Load reviews from Firestore
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setPicture(uri);
      setProfile((prev) => ({ ...prev, picture: uri }));


      const userId = auth.currentUser?.uid;
      if (userId) {
        try {
          await updateProfileInFirestore(userId, { picture: uri }); // <-- SAVE IT
          console.log("Profile picture saved successfully!");
        } catch (error) {
          console.error("Error saving profile picture: ", error);
        }
      }



    }
  };

  const toggleEditMode = async () => {
    if (editMode) {
      const profileData = {
        name: name || "",
        email: email || "",
        bio: bio || "",
        picture: picture || null,
      };
      const userId = auth.currentUser?.uid;
      if (userId) {
        await updateProfileInFirestore(userId, profileData);
        setProfile(profileData);
      }
    }
    setEditMode(!editMode);
  };


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      Alert.alert("Signed Out", "You have been signed out successfully.");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      console.error("Sign Out Error:", error);
      Alert.alert("Error", "Something went wrong while signing out.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/social1.png")}
          style={styles.logoOnly}
        />
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.topRight}>
        <Feather name="log-out" size={24} color="#B40324" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.pictureContainer}>
            {profile.picture ? (
              <Image source={{ uri: profile.picture }} style={styles.picture} />
            ) : (
              <Image
                source={require("../assets/new_profile.png")}
                style={styles.picture}
              />
            )}
          </TouchableOpacity>

          {editMode ? (
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.nameInput}
              placeholder="Your Name"
            />
          ) : (
            <Text style={styles.profileTitle}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.profileBox}>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={bio}
              onChangeText={setBio}
              placeholder="Write something about yourself..."
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.info}>Bio: {profile.bio}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={toggleEditMode}>
          <Feather
            name={editMode ? "check" : "edit"}
            size={28}
            color="#B40324"
          />
          <Text style={styles.editButtonText}>
            {editMode ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={addReview}>
            <Feather name="edit-3" size={22} color="#B40324" />
            <Text style={styles.actionText}>Add Review</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Feather name="camera" size={22} color="#B40324" />
            <Text style={styles.actionText}>Add Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Feather name="check-circle" size={22} color="#B40324" />
            <Text style={styles.actionText}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Friends")}
          >
            <Feather name="plus-square" size={22} color="#B40324" />
            <Text style={styles.actionText}>Foodie Friends</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.reviewHeader}>Share your experience</Text>
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <TouchableOpacity
                onPress={() => removeReview(item.id)}
                style={styles.absoluteClose}
              >
                <Feather name="x" size={18} style={styles.closeIcon} />
              </TouchableOpacity>

              <Image source={item.image} style={styles.reviewImage} />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewTitle}>{item.name}</Text>
                <Text style={styles.reviewQuestion}>
                  Do you recommend this business?
                </Text>
                <View style={styles.choiceRow}>
                  <TouchableOpacity style={styles.choiceButton}>
                    <Text>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.choiceButton}>
                    <Text>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.choiceButton}>
                    <Text>Maybe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 14 }}
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
      <BottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CFAFA6",
    paddingBottom: 50,
  },
  profileHeader: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 100,
  },

  pictureContainer: {
    borderWidth: 2,
    borderColor: "#B40324",
    borderRadius: 60,
  },
  picture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  nameInput: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: 150,
    textAlign: "center",
  },
  profileBox: {
    backgroundColor: "#CFAFA6",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "85%",
    borderWidth: 1.5,
    borderColor: "#B40324",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#B40324",
    textAlign: "center",
  },
  reviewHeader: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "900",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
    fontFamily: "HelveticaNeue-Bold",
    color: "#B40324",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
  },
  reviewCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "100%",
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  reviewTitle: {
    fontWeight: "600",
    fontSize: 18,
  },
  reviewQuestion: {
    color: "#444",
    fontSize: 15,
    marginTop: 6,
    marginBottom: 10,
  },
  choiceRow: {
    flexDirection: "row",
    gap: 10,
  },
  choiceButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  closeIcon: {
    color: "#888",
    padding: 6,
  },
  absoluteClose: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderColor: "#B40324",
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  tabItem: {
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 4,
  },
  topRight: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignSelf: "flex-start",
    paddingLeft: 20,
    marginTop: 20,
  },

  logoOnly: {
    width: 130,
    height: 40,
    resizeMode: "contain",
  },
  logoWrapper: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },

  logoOnly: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

const App = () => {
  return (
    <ProfileProvider>
      <Bio />
    </ProfileProvider>
  );
};

export default App;

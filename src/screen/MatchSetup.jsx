import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";

const ageOptions = Array.from({ length: 53 }, (_, i) => (i + 18).toString());
const genderOptions = ["Man", "Woman", "Other"];
const showMeOptions = ["Men", "Women", "Anyone"];
const lookingToMeetWith = ["Individuals", "Groups", "Both"];
const employmentOptions = [
  "Student",
  "Employed",
  "Self-employed",
  "Looking",
  "Prefer not to say",
];
const incomeOptions = [
  "Below 30k",
  "30-60k",
  "60-100k",
  "100k+",
  "Prefer not to say",
];
const meetupTimeOptions = ["Weekends", "Weekdays", "Evenings", "Flexible"];
const dietOptions = [
  "Vegan",
  "Vegetarian",
  "Halal",
  "Kosher",
  "Gluten-free",
  "None",
];
const allergiesOptions = ["Peanuts", "Shellfish", "Dairy", "Gluten", "Other"];
const goalOptions = [
  "Meet new foodie friends",
  "Explore restaurants together",
  "Just want to eat good food with chill people",
  "Possibly date",
];
const vibeOptions = [
  "Casual",
  "Chill Cafes",
  "Cultural spots",
  "Trendy/Fancy",
  "No preference",
];
const matchModeOptions = ["Auto", "Manual Suggestions"];
const cuisineOptions = [
  "Pizza",
  "Mexican",
  "Korean",
  "Sushi",
  "Ethiopian",
  "Indian",
  "Thai",
  "Chinese",
  "Japanese",
  "Italian",
  "American",
  "Mediterranean",
  "Middle Eastern",
  "French",
  "BBQ",
  "Seafood",
  "Nigerian",
];

const MatchSetup = () => {
  const [step, setStep] = useState(1);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    customGender: "",
    age: "",
    showMe: [],
    meetWith: "",
    status: "",
    employment: "",
    income: "",
    meetupTime: "",
    distance: 10,
    cuisines: [],
    diet: [],
    adventurousness: 3,
    allergies: [],
    otherAllergy: "",
    goals: [],
    vibe: [],
    matchMode: "",
  });
  const navigation = useNavigation();
  const toggleSelection = (field, value, single = false) => {
    if (single) {
      setFormData({ ...formData, [field]: value });
      if (field === "age") setShowAgeDropdown(false);
    } else {
      const current = formData[field];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setFormData({ ...formData, [field]: updated });
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    const requiredFields = [
      "gender",
      "age",
      "showMe",
      "status",
      "employment",
      "income",
      "meetupTime",
      "cuisines",
      "diet",
      "goals",
      "vibe",
      "matchMode",
    ];
    for (const field of requiredFields) {
      const value = formData[field];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        Alert.alert("Missing Info", `Please complete the "${field}" section.`);
        return;
      }
    }

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      await setDoc(
        doc(db, "users", userId),
        {
          preferences: formData,
          createdAt: new Date(),
        },
        { merge: true }
      );

      navigation.replace("MainPage");
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert(
        "Error",
        "Something went wrong while saving your preferences."
      );
    }
  };

  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderOptions = (title, options, field, single = false) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.optionWrap}>
        {options.map((opt) => (
          <Pressable
            key={opt}
            style={[
              styles.optionBox,
              formData[field]?.includes?.(opt) || formData[field] === opt
                ? styles.optionBoxSelected
                : null,
            ]}
            onPress={() => toggleSelection(field, opt, single)}
          >
            <Text
              style={[
                styles.optionText,
                formData[field]?.includes?.(opt) || formData[field] === opt
                  ? styles.optionTextSelected
                  : null,
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderAgeDropdown = () => (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>Age</Text>
      <Pressable
        style={styles.optionBox}
        onPress={() => setShowAgeDropdown(!showAgeDropdown)}
      >
        <Text style={styles.optionText}>{formData.age || "Select Age"}</Text>
      </Pressable>
      {showAgeDropdown && (
        <ScrollView style={styles.dropdownMenu} nestedScrollEnabled={true}>
          {ageOptions.map((age) => (
            <Pressable
              key={age}
              style={[
                styles.dropdownItem,
                formData.age === age && styles.optionBoxSelected,
              ]}
              onPress={() => toggleSelection("age", age, true)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  formData.age === age && styles.optionTextSelected,
                ]}
              >
                {formData.age === age ? "\u2713 " : ""}
                {age}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text style={styles.header}>Step 1: Basic Info</Text>
            {renderOptions("Gender", genderOptions, "gender", true)}
            {formData.gender === "Other" && (
              <TextInput
                placeholder="Enter your gender"
                style={styles.input}
                onChangeText={(val) =>
                  setFormData({ ...formData, customGender: val })
                }
              />
            )}
            {renderAgeDropdown()}
            {renderOptions("Show Me", showMeOptions, "showMe")}
            {renderOptions("Looking to meet with", lookingToMeetWith, "status")}
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.header}>Step 2: Lifestyle</Text>
            {renderOptions(
              "Employment Status",
              employmentOptions,
              "employment",
              true
            )}
            {renderOptions("Income Range", incomeOptions, "income", true)}
            {renderOptions(
              "Preferred Meetup Times",
              meetupTimeOptions,
              "meetupTime",
              true
            )}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>
                Distance: {formData.distance} miles
              </Text>
              <Slider
                minimumValue={1}
                maximumValue={50}
                step={1}
                value={formData.distance}
                onValueChange={(val) =>
                  setFormData({ ...formData, distance: val })
                }
                minimumTrackTintColor="#8D2D2A"
                maximumTrackTintColor="#aaa"
                thumbTintColor="#8D2D2A"
              />
            </View>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.header}>Step 3: Food Profile</Text>
            {renderOptions("Favorite Cuisines", cuisineOptions, "cuisines")}
            {renderOptions("Dietary Preferences", dietOptions, "diet")}

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>
                Adventurousness: {formData.adventurousness}
              </Text>
              <Slider
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={formData.adventurousness}
                onValueChange={(val) =>
                  setFormData({ ...formData, adventurousness: val })
                }
                minimumTrackTintColor="#8D2D2A"
                maximumTrackTintColor="#aaa"
                thumbTintColor="#8D2D2A"
              />
            </View>

            {renderOptions("Allergies", allergiesOptions, "allergies")}
            {formData.allergies.includes("Other") && (
              <TextInput
                placeholder="Enter other allergy"
                style={styles.input}
                onChangeText={(val) =>
                  setFormData({ ...formData, otherAllergy: val })
                }
              />
            )}
          </>
        );

      case 4:
        return (
          <>
            <Text style={styles.header}>Step 4: Vibe & Goals</Text>
            {renderOptions("Goals", goalOptions, "goals")}
            {renderOptions("Vibe", vibeOptions, "vibe")}
            {renderOptions("Match Mode", matchModeOptions, "matchMode", true)}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBarWrap}>
        <View style={[styles.progressBar, { width: `${(step / 4) * 100}%` }]} />
      </View>
      <ScrollView contentContainerStyle={styles.inner}>
        {renderStep()}
        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.halfButton]}
              onPress={handleBack}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              step > 1 ? styles.halfButton : styles.fullButton,
            ]}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {step === 4 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MatchSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CFAFA6",
  },
  inner: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    color: "#8D2D2A",
  },
  input: {
    borderWidth: 1,
    borderColor: "#8D2D2A",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  optionBox: {
    borderWidth: 2,
    borderColor: "#8D2D2A",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#eee",
    marginRight: 10,
    marginBottom: 10,
  },
  optionBoxSelected: {
    backgroundColor: "#8D2D2A",
  },
  optionText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8D2D2A",
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#8D2D2A",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  fullButton: {
    width: "100%",
  },
  halfButton: {
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  progressBarWrap: {
    height: 6,
    backgroundColor: "#ddd",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8D2D2A",
  },
  fieldBlock: {
    marginBottom: 20,
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import BottomTab from "./BottomTab";
import { useNavigation } from "@react-navigation/native";

const mockMatches = [
  {
    name: "Jessica",
    age: 25,
    diet: "Vegan",
    distance: "5 miles away",
    status: "Open to meet this week",
    emojis: ["🍜", "🥟", "🍰"],
    busy: false,
    action: "Message",
  },
  {
    name: "Alex",
    age: 29,
    diet: "Vegan",
    distance: "5 miles away",
    status: "You both love sushi!",
    emojis: ["🍣", "🍜", "🌶️"],
    busy: true,
    action: "Match",
  },
  {
    name: "Sarah",
    age: 27,
    diet: "None",
    distance: "3 miles away",
    status: "Busy right now",
    emojis: ["🍔", "🍩", "🍹"],
    busy: true,
    action: "Message",
  },
];

const Matches = () => {
  const [selectedTab, setSelectedTab] = useState("suggested");
  const navigation = useNavigation();

  const goToMatchSetup = () => {
    navigation.navigate("MatchSetup");
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>Your Matches</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "suggested" && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab("suggested")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "suggested" && styles.tabTextActive,
            ]}
          >
            Suggested
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "preferences" && styles.tabButtonActive,
          ]}
          onPress={goToMatchSetup}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "preferences" && styles.tabTextActive,
            ]}
          >
            Change My Preferences
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selectedTab === "suggested" &&
          mockMatches.map((user, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>
                  {user.name}, {user.age}
                </Text>
                {user.busy && (
                  <View style={styles.busyBadge}>
                    <Text style={styles.busyText}>Busy right now</Text>
                  </View>
                )}
              </View>

              <View style={styles.emojiRow}>
                {user.emojis.map((e, i) => (
                  <Text key={i} style={styles.emoji}>
                    {e}
                  </Text>
                ))}
              </View>

              <Text style={styles.status}>{user.status}</Text>
              <Text style={styles.subtext}>✓ {user.diet}</Text>
              <Text style={styles.subtext}>{user.distance}</Text>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>{user.action}</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

      <BottomTab />
    </View>
  );
};

export default Matches;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#CFAFA6",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8D2D2A",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 10,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#e4bfb5",
  },
  tabButtonActive: {
    backgroundColor: "#B40324",
  },
  tabText: {
    fontSize: 14,
    color: "#8D2D2A",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderColor: "#B40324",
    borderWidth: 1.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  busyBadge: {
    backgroundColor: "#FAD3D3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  busyText: {
    color: "#B40324",
    fontWeight: "600",
    fontSize: 12,
  },
  emojiRow: {
    flexDirection: "row",
    marginVertical: 4,
    gap: 6,
  },
  emoji: {
    fontSize: 22,
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 2,
  },
  subtext: {
    fontSize: 14,
    color: "#666",
  },
  actionButton: {
    backgroundColor: "#B40324",
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import BottomTab from "../screen/BottomTab";

export const partnerRestaurants = [
  {
    id: "1",
    title: "Gen Korean BBQ House",
    image: require("../assets/korean.png"),
    hasRewards: true,
    rewards: [{ description: "10% off any order", points: 400 }],
  },
  {
    id: "2",
    title: "Kura Revolving Sushi Bar",
    image: require("../assets/burger.png"),
    hasRewards: true,
    rewards: [{ description: "Free dessert", points: 300 }],
  },
  {
    id: "3",
    title: "Goobne Chicken 굽네치킨",
    image: require("../assets/boba.png"),
    hasRewards: true,
    rewards: [{ description: "Free drink", points: 200 }],
  },
];

const Rewards = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Rewards</Text>
        <Text style={styles.description}>
          Earn points by visiting restaurants suggested by Social Foodies.
        </Text>
        <TouchableOpacity style={styles.pointsButton}>
          <Text style={styles.points}>200 points</Text>
        </TouchableOpacity>

        <Text style={styles.partnerHeader}>Redeem at partner restaurants</Text>

        {partnerRestaurants
          .filter((restaurant) => restaurant.hasRewards)
          .map((restaurant) => (
            <View key={restaurant.id} style={styles.partnerCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={restaurant.image}
                  style={styles.restaurantImage}
                  resizeMode="contain"
                />
                <View style={styles.partnerBadge}>
                  <Text style={styles.partnerBadgeText}>PARTNER</Text>
                </View>
              </View>
              <Text style={styles.restaurantName}>{restaurant.title}</Text>
              <View style={styles.rewardList}>
                {restaurant.rewards.map((reward, index) => (
                  <View key={index} style={styles.rewardItem}>
                    <Text style={styles.rewardText}>{reward.description}</Text>
                    <Text style={styles.rewardPoints}>{reward.points} pts</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
      </ScrollView>
      <BottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 20,
    backgroundColor: "#CFAFA6",
  },
  header: {
    fontSize: 28,
    fontWeight: "900",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
    fontFamily: "HelveticaNeue-Bold",
    color: "#B40324",
    marginBottom: 5,
    padding: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  pointsButton: {
    backgroundColor: "#B40324",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  points: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  partnerHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  partnerCard: {
    backgroundColor: "#FCEBEB",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#B40324",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  imageContainer: {
    position: "relative",
    overflow: "visible",
  },
  restaurantImage: {
    width: "100%",
    height: 180,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 3,
    marginHorizontal: 16,
    textAlign: "center",
  },
  rewardItem: {
    borderRadius: 8,
    alignItems: "center",
  },
  rewardText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  rewardPoints: {
    fontSize: 16,
    color: "#B40324",
    fontWeight: "bold",
    marginBottom: 10,
  },
  partnerBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#B40324",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  partnerBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B40324",
  },
  rewardList: {
    marginHorizontal: 16,
  },
});

export default Rewards;

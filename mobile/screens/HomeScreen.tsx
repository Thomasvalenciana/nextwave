import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen({ navigation }: any) {
    const events = [
    { id: "1", title: "Drake – Miami" },
    { id: "2", title: "Bad Bunny – LA" },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Upcoming Events
      </Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EventDetails", { eventId: item.id })
            }
            style={{
              padding: 20,
              backgroundColor: "#eee",
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

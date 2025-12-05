import React from "react";
import { Text, View } from "react-native";

export default function EventDetails({ route }: any) {
  const { eventId } = route.params;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Event Details – {eventId}
      </Text>

      <Text style={{ marginTop: 20 }}>Live Setlist Updating Soon...</Text>
    </View>
  );
}

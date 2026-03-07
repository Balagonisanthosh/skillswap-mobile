import React from "react";
import { StyleSheet, Text, View } from "react-native";

const notification = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notification Page</Text>
    </View>
  );
};

export default notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // correct vertical alignment
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
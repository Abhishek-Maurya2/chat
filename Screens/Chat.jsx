import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const Chat = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.chatBtn} onPress={() => {}}>
        <MaterialIcons name="chat" size={24} color="#fff" />
      </Pressable>
    </View>
  );
};

export default Chat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chatBtn: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#2b68e6",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 12,
    right: 12,
  },
});

import { View, Text, StyleSheet } from "react-native";
import React from "react";
import PostCard from "./Community/PostCard";

const Community = () => {
  return <View style={styles.container}>
    <PostCard />
  </View>;
};

export default Community;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

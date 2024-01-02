import { Text, View, StyleSheet, ScrollView } from "react-native";
import React, { Component } from "react";
import MyStatus from "./statusComp/MyStatus.jsx";
import RecentStatus from "./statusComp/RecentStatus.jsx";
import ViewedStatus from "./statusComp/ViewedStatus.jsx";

const Status = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Status</Text>
      <ScrollView horizontal style={styles.status}>
        <MyStatus />
        <RecentStatus />
        <ViewedStatus />
      </ScrollView>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  status: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "400",
  },
});

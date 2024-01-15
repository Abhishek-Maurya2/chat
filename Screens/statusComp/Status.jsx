import { Text, View, StyleSheet, ScrollView } from "react-native";
import React, { Component } from "react";
import MyStatus from "./MyStatus.jsx";
import RecentStatus from "./RecentStatus.jsx";
import ViewedStatus from "./ViewedStatus.jsx";
import { Colors } from "../../components/Colors.js";

const Status = () => {
  return (
    <View style={styles.container}>
      <View style={styles.statusCont}>
        <Text style={styles.title}>Status</Text>
        <ScrollView horizontal style={styles.status}>
          <MyStatus />
          <RecentStatus />
          {/* <ViewedStatus /> */}
        </ScrollView>
      </View>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.backgroundColor },
  statusCont: {
    padding: 10,
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

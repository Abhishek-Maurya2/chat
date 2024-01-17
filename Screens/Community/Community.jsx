import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import {
  collection,
  getDoc,
  doc,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { FirebaseAuth, FirestoreDB } from "../../Auth/FirebaseConfig";
import { ActivityIndicator } from "react-native-paper";

const Community = () => {
  const CurrentlyLoggedInUserId = FirebaseAuth.currentUser.uid;
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  //collect all the docs where Followers array contains the current user's uid

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="black"
          style={{ alignItems: "center", justifyContent: "center" }}
        />
      ) : (
        <ScrollView></ScrollView>
      )}
    </View>
  );
};

export default Community;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

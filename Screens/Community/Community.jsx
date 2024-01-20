import { View, Text, StyleSheet, ScrollView, FlatList, FlatListComponent } from "react-native";
import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { FirebaseAuth, FirestoreDB } from "../../Auth/FirebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { useUser } from "../../components/User";

const Community = () => {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);

  //collect all the docs where Followers array contains the current user's uid
  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      const x = await useUser();
      const FollowingList = x.Following;
      const q = query(
        collection(FirestoreDB, "Posts"),
        where("createdBy", "in", FollowingList)
      );
      const querySnapshot = await getDocs(q);
      const tempPost = [];
      querySnapshot.forEach((doc) => {
        tempPost.push({ id: doc.id, ...doc.data() });
      });
      tempPost.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
      await setFeed(tempPost);
    };
    fetchPosts();
    // console.log(feed);
    setLoading(false);
  }, []); // Add x as a dependency

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="black"
          style={{ alignItems: "center", justifyContent: "center" }}
        />
      ) : (
        <FlatList
          data={feed}
          renderItem={({ item }) => <PostCard postData={item} />}
          keyExtractor={(item) => item.id}
        />
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

import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";
import { Avatar } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { Colors } from "../../components/Colors";
const PostCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.avatar}>
            <Avatar.Image size={40} />
          </Pressable>
          <View style={styles.profileContainer}>
            <Text style={styles.profileName}>Username</Text>
            <Text style={styles.profileTime}>Location</Text>
          </View>
        </View>
        <View style={styles.profileRight}>
          <Feather name="more-horizontal" size={24} color="black" />
        </View>
      </View>
      <View style={styles.postContent}>
        <Image
          source={require("../../assets/images/status.jpg")}
          style={styles.postMedia}
        />
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footerIconContainer}>
          <View style={styles.footerIconLeft}>
            <Feather
              name="heart"
              size={26}
              color="black"
              style={styles.reactionIcons}
            />
            <Feather
              name="message-circle"
              size={26}
              color="black"
              style={styles.reactionIcons}
            />
            <Feather name="send" size={26} color="black" />
          </View>
          <View style={styles.footerIconRight}>
            <Feather name="bookmark" size={26} color="black" />
          </View>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>Description</Text>
        </View>
        <View style={styles.comments}>
          <Text style={styles.commentsText}>Comments</Text>
          <Text style={styles.commentsText}>Time</Text>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {},
  profileContainer: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  profileTime: {
    fontSize: 12,
  },
  profileRight: {},
  postContent: {},
  postMedia: {
    width: "100%",
    height: 400,
  },
  footerContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: "#808080ae",
    borderBottomWidth: 0.3,
  },
  footerIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerIconLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerIconRight: {
    //nothing yet
  },
  reactionIcons: {
    marginRight: 15,
  },
  description: {
    marginTop: 5,
  },
});

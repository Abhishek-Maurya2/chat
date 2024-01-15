import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import { Feather } from "@expo/vector-icons";

import { FirebaseAuth, FirebaseStorage } from "../Auth/FirebaseConfig";
import { pickImage } from "../components/User";
import { Colors } from "../components/Colors";

const Home = ({ route }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const { user } = route.params;
  // console.log("Data in Home : ",user);

  const Logout = () => {
    // Logout logic here
    FirebaseAuth.signOut()
      .then(() => {
        console.log("User signed out!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    setImageUrl(user.profilePic);
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SuperApp</Text>
        <View style={styles.iconContainer}>
          <Pressable onPress={pickImage}>
            <Feather name="camera" size={20} color="black" />
          </Pressable>
          <Feather name="search" size={20} color="black" />
          <Pressable onPress={Logout}>
            {imageUrl && (
              <Image
                style={{ width: 35, height: 35, borderRadius: 20 }}
                source={{ uri: imageUrl }}
              />
            )}
          </Pressable>
        </View>
      </View>
      <Navigation />
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  headerContainer: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 12,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    borderColor: "#b8bab89f",
    borderBottomWidth: 0.6,
    borderLeftWidth: 0.6,
    borderRightWidth: 0.6,

  },
  iconContainer: {
    flexDirection: "row",
    width: 110,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
  },
});

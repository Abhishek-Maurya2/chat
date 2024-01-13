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
  },
  btn: {
    backgroundColor: "lightblue",
    padding: 15,
    borderRadius: 10,
  },
  headerContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 8,
    borderRadius: 15,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    elevation: 5,
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

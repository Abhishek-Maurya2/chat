import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Navigation from "../components/navigation";
import { Feather } from "@expo/vector-icons";

import { FirebaseAuth, FirebaseStorage } from "../Auth/FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

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
        <Text style={styles.headerText}>Alpha</Text>
        <View style={styles.iconContainer}>
          <Feather name="camera" size={20} color="white" />
          <Feather name="search" size={20} color="white" />
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
    backgroundColor: "#0e806a",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 18,
    paddingTop: 50,
    borderRadius: 15,
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
    color: "white",
  },
});

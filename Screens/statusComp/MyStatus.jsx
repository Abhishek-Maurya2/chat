import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useState } from "react";
import Img from "./../../assets/images/1.png";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  FirebaseStorage,
  FirestoreDB,
  FirebaseAuth,
} from "../../Auth/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, blob } from "firebase/storage";

const MyStatus = () => {
  const [status, setStatus] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setStatus(result.assets[0].uri);
      // console.log("Image: ", result.assets[0].uri);
      uploadStatus();
    }
  };

  const uploadStatus = async () => {
    const user = FirebaseAuth.currentUser.uid;
    const response = await fetch(status);
    const blob = await response.blob();
    const storageRef = ref(FirebaseStorage, "Status/" + user);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const data = {
      status: downloadURL,
    };
    await updateDoc(doc(FirestoreDB, "users", user), data);
  }
  
  return (
    <View style={styles.container}>
      <Pressable style={styles.boxUi} onPress={pickImage}>
        <Image source={Img} style={styles.Profile} />
        <View style={styles.iconBg}>
          <Feather name="plus" size={16} color="#fff" />
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.addStatus}>Tap to add status</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default MyStatus;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 10,
  },
  Profile: {
    width: 75,
    height: 75,
    borderRadius: 50,
    position: "relative",
  },
  iconBg: {
    backgroundColor: "#25D366",
    width: 20,
    height: 20,
    borderRadius: 50,
    position: "absolute",
    bottom: 50,
    left: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  addStatus: {
    color: "#777",
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },
  boxUi: {
    margin: 8,
    borderColor: "#777",
    borderWidth: 1,
    borderRadius: 10,
    width: 110,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

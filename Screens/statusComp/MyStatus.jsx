import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Img from "./../../assets/images/1.png";
import { Feather } from "@expo/vector-icons";
import {
  FirebaseStorage,
  FirestoreDB,
  FirebaseAuth,
} from "../../Auth/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, blob, uploadBytesResumable } from "firebase/storage";

import { useUser, pickImage } from "../../components/User.jsx";


const MyStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const usersData = useUser();
  useEffect(() => {
    // console.log("Status Screen Data : ", usersData);
    if (usersData) {
      setLoading(false);
    }
  }, [usersData]);

  
  const pick = async () => {
    const data = await pickImage();
    if(data) {
      setStatus(data);
      uploadStatus();
    }
    else {
      console.log("No Image Selected");
    }
  }

  const uploadStatus = async () => {
    const user = FirebaseAuth.currentUser.uid;
    const response = await fetch(status.uri);
    const blob = await response.blob();
    const storageRef = ref(FirebaseStorage, "Status/" + user);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    });

    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);
    const data = {
      status: downloadURL,
      statusType: status.type,
    };
    await updateDoc(doc(FirestoreDB, "users", user), data);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.boxUi} onPress={pick}>
        {loading ? (
          <Image source={Img} style={styles.Profile} />
        ) : (
          <Image source={{ uri: usersData.profilePic }} style={styles.Profile} />
        )}
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

import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Img from "./../../assets/images/1.png";
import { Feather } from "@expo/vector-icons";

import { FirebaseAuth, FirebaseStorage, FirestoreDB } from "../../Auth/FirebaseConfig";
import {doc, getDoc} from "firebase/firestore";

const MyStatus = () => {
  
  // const fetchData = async () => {
  //   const docRef = doc(FirestoreDB, "users", "uid"); // replace with your collection and document

  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     console.log("Document data:", docSnap.data());
  //   } else {
  //     console.log("No such document!");
  //   }
  // };


  return (
    <View style={styles.container}>
      <View style={styles.boxUi}>
        <Image source={Img} style={styles.Profile} />
        <View style={styles.iconBg}>
          <Feather name="plus" size={16} color="#fff" />
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.addStatus}>Tap to add status</Text>
        </View>
      </View>
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

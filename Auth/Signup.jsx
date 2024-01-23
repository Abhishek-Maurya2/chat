import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { FirebaseAuth, FirestoreDB, FirebaseStorage } from "./FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../store/AuthStore";

const Signup = () => {
  const navigation = useNavigation();
  // const SignUpUser = useAuthStore((state) => state.login);

  //image picker
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log("Image: ", result.assets[0].uri);
    }
  };

  //signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");

  const handleSignUp = async () => {
    if (email !== "" && pass !== "" && name !== "" && image !== null) {
      await createUserWithEmailAndPassword(FirebaseAuth, email, pass)
        .then(async (userCred) => {
          const response = await fetch(image);
          const blob = await response.blob();
          const storageRef = ref(
            FirebaseStorage,
            "ProfilePic/" + userCred.user.uid
          );
          const snapshot = await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(snapshot.ref);
          const data = {
            _id: userCred.user.uid,
            fullName: name,
            PhoneNumber: PhoneNumber,
            profilePic: downloadURL,
            providerData: userCred.user.providerData[0],
            Followers: [],
            Following: [],
            Posts: [],
          };
          setDoc(doc(FirestoreDB, "users", userCred.user.uid), data)
            .then(() => {
              AsyncStorage.setItem("LoggedIn-User", JSON.stringify(data));
              // SignUpUser(data);
              navigation.navigate("SplashScreen");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        })
        .catch((error) => {
          console.error("Error creating user: ", error);
        });
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profilePic} />
          ) : (
            <Text style={styles.ProfileTxt}>Set Profile</Text>
          )}
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={setPass}
      />
      <TouchableOpacity style={styles.btn} onPress={handleSignUp}>
        <Text>Signup</Text>
      </TouchableOpacity>
      <View style={styles.nav}>
        <Text style={styles.txt}>Already have an Account, </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.txts}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 50,
    width: 300,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  btn: {
    height: 50,
    width: 100,
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
  },
  nav: {
    flexDirection: "row",
  },
  txt: {
    fontSize: 15,
  },
  txts: {
    fontSize: 15,
    fontWeight: "bold",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  ProfileTxt: {
    fontSize: 15,
    alignSelf: "center",
    padding: 15,
    backgroundColor: "lightblue",
    borderRadius: 10,
  },
});

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/navigation";
import {
  FirebaseAuth,
  FirebaseStorage,
  FirestoreDB,
} from "../Auth/FirebaseConfig";
import { pickCamera, pickImage } from "../components/User";
import { Colors } from "../components/Colors";

import RBSheet from "react-native-raw-bottom-sheet";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ActivityIndicator, ProgressBar, Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "../store/AuthStore";
import { useNavigation } from "@react-navigation/native";


const Home = () => {
  const navigation = useNavigation();
  // const LogoutUser = useAuthStore(state => state.logout);
  const refRBSheet = useRef();
  let user;

  const Logout = () => {
    // Logout logic here
    FirebaseAuth.signOut()
      .then(() => {
        AsyncStorage.removeItem("LoggedIn-User");
        // LogoutUser();
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await AsyncStorage.getItem("LoggedIn-User");
      user = JSON.parse(data);
      setImageUrl(user?.profilePic);
    }
    fetchUserData();
  }, []);

  const [postImage, setPostImage] = useState(null);
  const handleCamera = async () => {
    const x = await pickCamera();
    setPostImage(x);
  };
  const handleImage = async () => {
    const x = await pickImage();
    setPostImage(x);
  };
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [pg, setPg] = useState(0);
  const UploadMedia = async () => {
    const name = `${Math.random().toString(36).substring(1)}`;
    const response = await fetch(postImage.uri);
    const blob = await response.blob();
    const storageRef = ref(FirebaseStorage, `PostMedias/${user._id}/${name}/`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setPg(progress / 100);
    });

    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };
  const MakePost = async () => {
    setLoading(true);
    if (postImage) {
      const image = await UploadMedia();
      const newPost = {
        caption: caption,
        image: image,
        likes: [],
        comments: [],
        createdBy: user._id,
        createdAt: new Date(),
      };
      const postRef = await addDoc(collection(FirestoreDB, "Posts"), newPost);
      const userRef = doc(FirestoreDB, "users", user._id);
      await updateDoc(userRef, { Posts: arrayUnion(postRef.id) }).then(() => {
        console.log("Post Added!");
        setPostImage(null);
        setCaption("");
        setLoading(false);
        refRBSheet.current.close();
      });
    }
  };

  return (
    <View style={styles.container}>
      
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
});

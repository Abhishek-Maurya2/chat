import { useState, useEffect } from "react";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";
import { collection, getDocs, query, where, onSnapshot, orderBy, limit, doc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import * as VideoThumbnails from "expo-video-thumbnails";
import { Camera, CameraType } from "expo-camera";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

let user = FirebaseAuth.currentUser;
export const useUser = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = FirebaseAuth.currentUser;
    const getUserData = async () => {
      const docRef = doc(FirestoreDB, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    getUserData();
  }, []);

  // console.log("Exported users Data", userData);
  return userData;
};

export const generateThumbnail = async (videoUri) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
      time: 1000,
    });
    console.log("Thumbnail uri in user: ", uri);
    return uri;
  } catch (e) {
    console.warn(e);
    return null;
  }
};
export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const type = uri.split(".").pop();
    // console.log("Image: ", uri, type);
    return { uri, type };
  }

  return null;
};

export const pickCamera = async () => {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    const type = uri.split(".").pop();
    // console.log("Image: ", uri, type);
    return { uri, type };
  }

  return null;
};

export const getLastMessage = async (chatId) => {
  let chatRoomID;
  if (user.uid < chatId) {
    chatRoomID = `${user.uid}_${chatId}`;
  } else {
    chatRoomID = `${chatId}_${user.uid}`;
  }

  const q = query(
    collection(FirestoreDB, "chatRooms", chatRoomID, "Messages"),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const lastMessage = querySnapshot.docs[0].data();
    // console.log("last messages : ", lastMessage);
    const x = {
      text: lastMessage.text,
      createdAt: lastMessage.createdAt,
      fileTypes: lastMessage.fileType,
    }
    console.log("Exported last message: ", x);
    return x;
  } else {
    console.log("No messages in this chat room!");
  }
};
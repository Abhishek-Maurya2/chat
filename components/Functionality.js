import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDoc,
} from "firebase/firestore";

export const Follow = async (friendId) => {
  const CurrentUser = FirebaseAuth.currentUser;
  const ref = doc(FirestoreDB, "Posts", friendId.id);
  await setDoc(
    ref,
    {
      Followers: arrayUnion(CurrentUser.uid),
    },
    { merge: true }
  );

  return true;
};

export const UnFollow = async (friendId) => {
  const CurrentUser = FirebaseAuth.currentUser;
  const ref = doc(FirestoreDB, "Posts", friendId.id);
  await setDoc(
    ref,
    {
      Followers: arrayRemove(CurrentUser.uid),
    },
    { merge: true }
  );

  return false;
};
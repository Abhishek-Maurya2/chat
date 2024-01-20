import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

export const Follow = async (friendId) => {
  const CurrentUser = FirebaseAuth.currentUser;
  const refUser = doc(FirestoreDB, "users", CurrentUser.uid);
  await updateDoc(refUser, {
    Following: arrayUnion(friendId.id),
  });
  const refFriend = doc(FirestoreDB, "users", friendId.id);
  await updateDoc(refFriend, {
    Followers: arrayUnion(CurrentUser.uid),
  });

  return true;
};

export const UnFollow = async (friendId) => {
  const CurrentUser = FirebaseAuth.currentUser;
  const refUser = doc(FirestoreDB, "users", CurrentUser.uid);
  await updateDoc(refUser, {
    Following: arrayRemove(friendId.id),
  });
  const refFriend = doc(FirestoreDB, "users", friendId.id);
  await updateDoc(refFriend, {
    Followers: arrayRemove(CurrentUser.uid),
  });

  return false;
};

export const getUserById = async (userId) => {
  const ref = doc(FirestoreDB, "users", userId);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};

export const likePost = async (postId) => {
  const CurrentUser = FirebaseAuth.currentUser;
  const ref = doc(FirestoreDB, "Posts", postId);
  await updateDoc(ref, {
    likes: arrayUnion(CurrentUser.uid),
  });
  console.log("Liked");
  return true;
};

export const unlikePost = async (postId) => {
  const CurrentUser = FirebaseAuth.currentUser;
  const ref = doc(FirestoreDB, "Posts", postId);
  await updateDoc(ref, {
    likes: arrayRemove(CurrentUser.uid),
  });
  console.log("UnLiked");
  return false;
}

export const commentPost = async (postId, comment) => {
  const CurrentUser = FirebaseAuth.currentUser;
  const ref = doc(FirestoreDB, "Posts", postId);
  await updateDoc(ref, {
    comments: arrayUnion({comment: comment, commentedBy: CurrentUser.uid, commentedAt: new Date()}),
  });
  // console.log("Commented");
}

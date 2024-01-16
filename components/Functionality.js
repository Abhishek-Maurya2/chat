import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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

// export const CheckFollow = async (friendId) => {
//   const CurrentUser = FirebaseAuth.currentUser;
//   const refUser = doc(FirestoreDB, "users", CurrentUser.uid);
//   const docSnap = await refUser.get();
//   if (docSnap.exists()) {
//     const data = docSnap.data();
//     const Following = data.Following;
//     if (Following.includes(friendId.id)) {
//       return true;
//     } else {
//       return false;
//     }
//   } else {
//     console.log("Error in Checking Followings");
//   }
// };

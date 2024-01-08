import { useState, useEffect } from "react";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
export const useUser = () => {
  const user = FirebaseAuth.currentUser;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
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

  console.log("Exported users Data", userData);
  return userData;
};

export const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        console.log("Image: ", result.assets[0].uri);
        return result.assets[0].uri;
    }

    return null;
};

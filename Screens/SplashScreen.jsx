import { View, ActivityIndicator } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from "firebase/firestore";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";


const SplashScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        checkLoggedIn();
        
    });

    const checkLoggedIn = async () => {
      FirebaseAuth.onAuthStateChanged((userCred) => {
        if (userCred?.uid) {
          getDoc(doc(FirestoreDB, "users", userCred?.uid))
            .then((docSnap) => {
              if (docSnap.exists()) {
                console.log("Splash Screen: ", docSnap.data());
              }
            })
            .then(() => {
              navigation.replace("Home");
            });
        } else {
          navigation.replace("Login");
        }
      });
    };
  return (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}

export default SplashScreen
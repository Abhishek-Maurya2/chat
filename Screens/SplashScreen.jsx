import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from "firebase/firestore";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";
import { styleProps } from 'react-native-web/dist/cjs/modules/forwardedProps';


const SplashScreen = () => {
  const [User, setUser] = useState();
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
                const userData = docSnap.data();
                setUser(userData);
                // console.log("Snapshot data:", User);
                navigation.replace("Home", { user: userData });
                }
              })
        } else {
          navigation.replace("Login");
        }
      });
    };
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  )
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
import { View, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from "firebase/firestore";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";
import { styleProps } from 'react-native-web/dist/cjs/modules/forwardedProps';
import { ActivityIndicator } from "react-native-paper";
import { Colors } from '../components/Colors';

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
      <ActivityIndicator animating={true} color={Colors.primary} size={40} />
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
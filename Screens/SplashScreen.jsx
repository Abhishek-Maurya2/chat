import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseAuth, FirestoreDB } from "../Auth/FirebaseConfig";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "../components/Colors";
import useAuthStore from "../store/AuthStore";

const SplashScreen = () => {
  // const LoggedInUser = useAuthStore((state) => state.user);
  const [User, setUser] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    checkLoggedIn();
    // if (LoggedInUser) {
    //   navigation.replace("Home", { user: LoggedInUser });
    // } else {
    //   navigation.replace("Login");
    // }
  });

  const checkLoggedIn = async () => {
    FirebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(FirestoreDB, "users", userCred?.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser(userData);
            // console.log("Snapshot data:", User);
            navigation.replace("Home", { user: userData });
          }
        });
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
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

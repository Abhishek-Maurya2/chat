import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";

import { FirebaseAuth, FirestoreDB } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigation = useNavigation();
  //login
   const [email, setEmail] = useState("");
   const [pass, setPass] = useState("");

   const handleLogin = async () => {
     if (email && pass != "") {
       await signInWithEmailAndPassword(FirebaseAuth, email, pass)
         .then((userCred) => {
           if (userCred) {
             getDoc(doc(FirestoreDB, "users", userCred?.user.uid)).then(
               (docSnap) => {
                 if (docSnap.exists()) {
                  //  console.log("DocSnap Data: ", docSnap.data());
                 }
               }
             );
           }
         })
         .catch((error) => {
           console.log("Error: ", error.message);
           alert(error.message);
         });
     } else {
       alert("Please enter email and password");
     }
   };
  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={styles.input} onChangeText={setPass} />
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
      <View style={styles.nav}>
      <Text style={styles.txt}>Don't have an Account, </Text>
        <TouchableOpacity onPress={() => {navigation.navigate("Signup")}}>
          <Text style={styles.txts}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 50,
        width: 300,
        padding: 15,
        margin: 10,
        borderWidth: 1,
        borderRadius: 10,
    },
    btn: {
        height: 50,
        width: 100,
        padding: 15,
        margin: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "lightblue",
    },
    nav: {
        flexDirection: "row",
    },
    txt: {
        fontSize: 15,
    },
    txts: {
        fontSize: 15,
        fontWeight: "bold",

    },
})
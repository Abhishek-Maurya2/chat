import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

import { setDoc, collection, addDoc, doc } from "firebase/firestore";
import { firestoreDB } from "./../../Auth/FirebaseConfig"

const AddChat = () => {
//   const navigation = useNavigation();
//   const user = useSelector((state) => state.userAuth.user);
//   console.log("Add Chat : ", user);
const navigation = useNavigation();
  const [showSearch, setShowSearch] = useState(false);
  const [addChat, setAddChat] = useState("");
  const OnSearch = () => {
    setShowSearch(true);
  };

//   const createNewChat = async () => {
//     let id = `${Date.now()}`;
//     const _doc = {
//       _id: id,
//       user: user,
//       chatName: addChat,
//     };
//     if (addChat !== "") {
//       setDoc(doc(firestoreDB, "chats", id), _doc)
//         .then(() => {
//           setAddChat("");
//           navigation.replace("Home");
//         })
//         .catch((err) => {
//           console.log(err);
//           alert("Error : ", err);
//         });
//     }
//   };
  return (
    <View style={styles.container}>
      {showSearch ? (
        <View>
          <View style={styles.searchbar}>
            <Feather
              style={styles.BackIcon}
              name="arrow-left"
              size={20}
              color="white"
              onPress={() => setShowSearch(false)}
            />
            <TextInput
              style={styles.input}
              placeholder="Search"
              value={addChat}
              onChangeText={(text) => setAddChat(text)}
            />
          </View>
          <View style={styles.addCont}>
            <Pressable style={styles.btnCont} onPress={() =>{}}>
              <Feather
                name="user-plus"
                size={28}
                color="white"
                style={styles.addIcon}
              />
              <Text style={styles.add}>Add User</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.Headercontainer}>
          <View style={styles.left}>
            <Feather
              style={styles.BackIcon}
              name="arrow-left"
              size={20}
              color="white"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Add Chat</Text>
          </View>
          <View style={styles.right}>
            <Feather
              style={styles.icon}
              name="search"
              size={20}
              color="white"
              onPress={OnSearch}
            />
            <Image style={styles.profile} source={require("./../../assets/images/1.png")} />
          </View>
        </View>
      )}
    </View>
  );
};
export default AddChat;
const styles = StyleSheet.create({
  add: {
    fontSize: 16,
    color: "black",
    fontWeight: "400",
    paddingLeft: 15,
  },
  addIcon: {
    backgroundColor: "#0e806a",
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCont: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
  searchbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0e806a",
    padding: 10,
    borderRadius: 15,
    paddingTop: 50,
    paddingBottom: 15,
  },
  input: {
    fontSize: 16,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: "80%",
    backgroundColor: "white",
  },
  profile: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
  Headercontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingTop: 60,
    backgroundColor: "#0e806a",
    borderRadius: 15,
    paddingBottom: 20,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "30%",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    paddingHorizontal: 18,
  },
  BackIcon: {
    paddingRight: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});

import {
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

import { FirestoreDB, firestoreDB } from "./../../Auth/FirebaseConfig";
import { getDocs, query, where, collection, orderBy, startAt, endAt } from "firebase/firestore";

const AddChat = () => {
  const navigation = useNavigation();

  const [showSearch, setShowSearch] = useState(false);
  const [addChat, setAddChat] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (addChat) {
      search();
    }
  }, [addChat]);

  const OnSearch = () => {
    setShowSearch(true);
  };

 const search = async () => {
   const q = query(
     collection(FirestoreDB, "users"),
     orderBy("PhoneNumber"),
     startAt(addChat),
     endAt(`${addChat}\uf8ff`)
   );
   const querySnapshot = await getDocs(q);
   const results = [];
   querySnapshot.forEach((doc) => {
     results.push(doc.data());
     console.log(doc.data());
   });
   setSearchResults(results);
 };



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
            <Pressable style={styles.btnCont} onPress={search}>
              <Feather
                name="user-plus"
                size={28}
                color="white"
                style={styles.addIcon}
              />
              <Text style={styles.add}>Add User</Text>
            </Pressable>
            {searchResults.map((user, index) => (
              <View key={index}>
                {/* Replace 'name' and 'phoneNumber' with the actual field names in your Firestore documents */}
                <Pressable onPress={() => navigation.navigate(ChatPage)}>
                  <View style={styles.listItem}>
                    <Image
                      source={{ uri: user.profilePic }}
                      style={styles.photos}
                    />
                    <View style={styles.metaData}>
                      <Text style={styles.name}>{user.fullName}</Text>
                      <Text style={styles.time}>{user.PhoneNumber}</Text>
                    </View>
                  </View>
                </Pressable>
              </View>
            ))}
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
            <Image
              style={styles.profile}
              source={require("./../../assets/images/1.png")}
            />
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
  listItem: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
  },
  photos: {
    width: 45,
    height: 45,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  metaData: {
    borderBottomWidth: 0,
    marginLeft: 10,
    marginBottom: 10,
    paddingBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  
});

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

import { FirestoreDB, FirebaseAuth } from "./../../Auth/FirebaseConfig";
import {
  getDocs,
  query,
  doc,
  collection,
  orderBy,
  startAt,
  endAt,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { Colors } from "../../components/Colors";

const AddChat = () => {
  const navigation = useNavigation();
  const uid = FirebaseAuth.currentUser.uid;

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
      // console.log("Search Data  : ",doc.data());
    });
    setSearchResults(results);
  };

  const CreateChatRoom = async (friendID) => {
    let chatRoomID;
    if (uid < friendID) {
      chatRoomID = `${uid}_${friendID}`;
    } else {
      chatRoomID = `${friendID}_${uid}`;
    }
    const ref = doc(FirestoreDB, "chatRooms", chatRoomID);
    await setDoc(ref, {
      participants: [uid, friendID],
    });
    const friendRef = doc(FirestoreDB, "users", friendID);
    await updateDoc(friendRef, {
      participants: arrayUnion(uid),
    });
    const userRef = doc(FirestoreDB, "users", uid);
    await updateDoc(userRef, {
      participants: arrayUnion(friendID),
    }).then(() => {
      navigation.goBack();
    });
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
              color="black"
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
            <Pressable style={styles.btnCont}>
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
                <Pressable
                  onPress={() => {
                    CreateChatRoom(user._id);
                  }}
                >
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
              color="black"
              onPress={() => navigation.goBack()}
            />
            <Text style={styles.title}>Add Chat</Text>
          </View>
          <View style={styles.right}>
            <Feather
              style={styles.icon}
              name="search"
              size={20}
              color="black"
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
    backgroundColor: Colors.background,
    padding: 10,
    paddingTop: 0,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    paddingBottom: 10,
  },
  input: {
    fontSize: 16,
    borderRadius: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: "80%",
    backgroundColor: "#8ba28c26",
  },
  profile: {
    height: 35,
    width: 35,
    borderRadius: 25,
  },
  Headercontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingTop: 9,
    backgroundColor: Colors.background,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    paddingBottom: 10,
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
    color: "black",
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

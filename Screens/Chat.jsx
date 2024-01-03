import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { FirestoreDB, FirebaseAuth } from "../Auth/FirebaseConfig";
import { collection, doc, getDocs, query, where, onSnapshot } from "firebase/firestore";

const Chat = () => {
  const user = FirebaseAuth.currentUser;
  const navigation = useNavigation();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(
      collection(FirestoreDB, "users"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    
    // console.log("Chats : ", chats);
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {chats.map((chat) => (
        <Pressable
          key={chat._id}
          onPress={() => navigation.navigate("ChatPage", { chatId: chat })}
        >
          <View style={styles.listItem}>
            <Image source={{ uri: chat.profilePic }} style={styles.photos} />
            <View style={styles.metaData}>
              <View style={styles.title}>
                <Text style={styles.name}>{chat.fullName}</Text>
                <Text style={styles.time}>
                  {/* {chat.LastMessageTime.seconds &&
                    new Date(parseInt(chat.LastMessageTime.seconds) * 1000).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    )} */}
                    time
                </Text>
              </View>
              <View style={styles.message}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  last Message
                </Text>
                <Text style={styles.unread}>9</Text>
              </View>
            </View>
          </View>
        </Pressable>
      ))}

      <Pressable
        style={styles.chatBtn}
        onPress={() => navigation.navigate("AddChat")}
      >
        <MaterialIcons name="chat" size={24} color="#fff" />
      </Pressable>
    </View>
  );
};
export default Chat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
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
    flex: 5,
    borderBottomWidth: 0,
    marginLeft: 10,
    marginBottom: 10,
    paddingBottom: 10,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
  },
  time: {
    fontSize: 12,
    color: "#666",
  },
  message: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    width: "90%",
  },
  unread: {
    backgroundColor: "#25D",
    color: "#fff",
    fontSize: 12,
    borderRadius: 30,
    width: 20,
    height: 20,
    textAlign: "center",
    paddingTop: 2,
  },
  chatBtn: {
    position: "absolute",
    bottom: 11,
    right: 11,
    backgroundColor: "#128C7E",
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

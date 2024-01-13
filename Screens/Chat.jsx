import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";

import { Colors } from "../components/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { FirestoreDB, FirebaseAuth } from "../Auth/FirebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDoc,
} from "firebase/firestore";

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

  const [lastMessage, setLastMessage] = useState(null);
  const getLastMessage = async (chatId) => {
    let chatRoomID;
    if (user.uid < chatId) {
      chatRoomID = `${user.uid}_${chatId}`;
    } else {
      chatRoomID = `${chatId}_${user.uid}`;
    }

    const q = query(
      collection(FirestoreDB, "chatRooms", chatRoomID, "Messages"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const lastMessage = querySnapshot.docs[0].data();
      // console.log("last messages : ", lastMessage);
      return lastMessage;
    } else {
      console.log("No messages in this chat room!");
    }
  };

  useEffect(() => {
    const fetchLastMessages = async () => {
      const newLastMessages = {};
      for (const chat of chats) {
        const message = await getLastMessage(chat._id);
        newLastMessages[chat._id] = message;
      }
      setLastMessage(newLastMessages);
    };

    fetchLastMessages();
  }, [chats]);
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
                  {lastMessage[chat._id]?.createdAt
                    ?.toDate()
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  {/* time */}
                </Text>
              </View>
              <View style={styles.message}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {lastMessage[chat._id]?.text}
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
        <MaterialIcons name="chat" size={24} color={Colors.onprimaryContainer} />
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
    marginTop: 2,
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
    marginTop: 2,
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
    backgroundColor: Colors.primaryContainer,
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
});

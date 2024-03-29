import { Text, View, StyleSheet, Image, Pressable, TextInput } from "react-native";
import React, { useState, useEffect, useRef } from "react";

import { Colors } from "../../components/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { FirestoreDB, FirebaseAuth } from "../../Auth/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  doc,
  updateDoc,
  arrayUnion,
  addDoc,

} from "firebase/firestore";
import ViewModal from "../../components/ViewModal";
import RBSheet from "react-native-raw-bottom-sheet";
import { Feather } from "@expo/vector-icons";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ActivityIndicator, ProgressBar, Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = () => {
  const navigation = useNavigation();
  const user = FirebaseAuth.currentUser;
  const refRBSheet = useRef();
  let users;

  const Logout = () => {
    // Logout logic here
    FirebaseAuth.signOut()
      .then(() => {
        AsyncStorage.removeItem("LoggedIn-User");
        // LogoutUser();
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await AsyncStorage.getItem("LoggedIn-User");
      users = JSON.parse(data);
      setImageUrl(users?.profilePic);
    };
    fetchUserData();
  }, []);

  const [postImage, setPostImage] = useState(null);
  const handleCamera = async () => {
    const x = await pickCamera();
    setPostImage(x);
  };
  const handleImage = async () => {
    const x = await pickImage();
    setPostImage(x);
  };
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [pg, setPg] = useState(0);
  const UploadMedia = async () => {
    const name = `${Math.random().toString(36).substring(1)}`;
    const response = await fetch(postImage.uri);
    const blob = await response.blob();
    const storageRef = ref(FirebaseStorage, `PostMedias/${users._id}/${name}/`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setPg(progress / 100);
    });

    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };
  const MakePost = async () => {
    setLoading(true);
    if (postImage) {
      const image = await UploadMedia();
      const newPost = {
        caption: caption,
        image: image,
        likes: [],
        comments: [],
        createdBy: users._id,
        createdAt: new Date(),
      };
      const postRef = await addDoc(collection(FirestoreDB, "Posts"), newPost);
      const userRef = doc(FirestoreDB, "users", users._id);
      await updateDoc(userRef, { Posts: arrayUnion(postRef.id) }).then(() => {
        console.log("Post Added!");
        setPostImage(null);
        setCaption("");
        setLoading(false);
        refRBSheet.current.close();
      });
    }
  };

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

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handlePress = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SuperApp</Text>
        <View style={styles.iconContainer}>
          <Pressable
            android_ripple={{ color: "grey" }}
            onPress={() => refRBSheet.current.open()}
            style={{
              borderWidth: 1,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="plus" size={20} color="black" />
          </Pressable>
          <Feather name="search" size={20} color="black" />
          <Pressable onPress={Logout}>
            <Avatar.Image
              size={35}
              source={{
                uri: imageUrl,
              }}
            />
          </Pressable>
        </View>
      </View>
      {chats.map((chat) => (
        <Pressable
          key={chat._id}
          onPress={() => navigation.navigate("ChatPage", { chatId: chat })}
        >
          <View style={styles.listItem}>
            <Pressable onPress={() => handlePress(chat)}>
              <Image source={{ uri: chat.profilePic }} style={styles.photos} />
            </Pressable>
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
        <MaterialIcons name="chat" size={24} color={Colors.background} />
      </Pressable>
      {isModalVisible && (
        <ViewModal
          item={selectedItem}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      )}
      <RBSheet
        height={555}
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={() => setPostImage(null)}
        customStyles={{
          wrapper: {
            backgroundColor: "#00000089",
          },
          draggableIcon: {
            backgroundColor: "#d5d5d5",
          },
          container: {
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            borderWidth: 0.5,
            borderColor: "#808080a6",
          },
        }}
      >
        <View>
          {loading && (
            <ProgressBar
              progress={pg}
              color={Colors.primary}
              style={{ height: 3 }}
            />
          )}

          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 10,
              marginHorizontal: 20,
            }}
          >
            Add Post
          </Text>
          <View style={{ marginHorizontal: 20 }}>
            {postImage ? (
              <Image
                style={{
                  width: "100%",
                  height: 260,
                  resizeMode: "cover",
                  borderRadius: 20,
                }}
                source={{ uri: postImage.uri }}
              />
            ) : (
              <Pressable
                android_ripple={{ color: "grey" }}
                onPress={() => handleImage()}
                style={{
                  backgroundColor: "#9897974e",
                  height: 260,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="image" size={50} color="grey" />
                <Text style={{ fontSize: 18, color: "grey" }}>
                  No Image Selected.
                </Text>
              </Pressable>
            )}
          </View>
          <Pressable
            android_ripple={{ color: "grey" }}
            onPress={() => handleImage()}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="image" size={20} color="#186eca" />
            <Text style={{ fontSize: 18, marginLeft: 20 }}>Add Image</Text>
          </Pressable>
          <Pressable
            android_ripple={{ color: "grey" }}
            onPress={() => handleCamera()}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="camera" size={20} color="#e53838" />
            <Text style={{ fontSize: 18, marginLeft: 20 }}>Take Photo</Text>
          </Pressable>
          <TextInput
            placeholder="Enter Caption"
            multiline
            numberOfLines={3}
            onChangeText={(text) => setCaption(text)}
            style={{
              marginVertical: 15,
              marginHorizontal: 20,
              backgroundColor: "#9897974e",
              borderRadius: 30,
              paddingHorizontal: 20,
              fontSize: 15,
              paddingVertical: 0,
            }}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable
              android_ripple={{ color: "grey" }}
              onPress={() => MakePost()}
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.primary,
                borderRadius: 30,
                marginHorizontal: 20,
                paddingHorizontal: 20,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Feather name="send" size={20} color="#ffffff" />
              )}
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.background,
                  marginLeft: 8,
                }}
              >
                Post
              </Text>
            </Pressable>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};
export default Chat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  headerContainer: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 12,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    borderColor: "#b8bab89f",
    borderBottomWidth: 0.6,
    borderLeftWidth: 0.6,
    borderRightWidth: 0.6,
  },
  iconContainer: {
    flexDirection: "row",
    width: 110,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
  },
  listItem: {
    flexDirection: "row",
    marginLeft: 10,
    marginRight: 10,
    margin: 10,
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
    marginLeft: 10,
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
    backgroundColor: Colors.primary,
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

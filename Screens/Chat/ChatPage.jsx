import {
  ImageBackground,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import wallpaper from "./../../assets/images/wall.jpg";

import { Feather, FontAwesome } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

import {
  FirestoreDB,
  FirebaseAuth,
  FirebaseStorage,
} from "./../../Auth/FirebaseConfig";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import {
  doc,
  onSnapshot,
  orderBy,
  arrayUnion,
  setDoc,
  addDoc,
  serverTimestamp,
  collection,
  query,
} from "firebase/firestore";
import { pickCamera, pickImage } from "../../components/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";

const ChatPage = ({ route }) => {
  const navigation = useNavigation();

  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    // If the user has scrolled to the bottom, hide the scroll icon
    if (yOffset + scrollViewHeight >= contentHeight) {
      setShowScrollIcon(false);
    } else {
      setShowScrollIcon(true);
    }
  };

  const data = route.params.chatId;
  const friend = route.params.chatId._id;
  const user = FirebaseAuth.currentUser.uid;
  let chatRoomID;
  if (user < friend) {
    chatRoomID = `${user}_${friend}`;
  } else {
    chatRoomID = `${friend}_${user}`;
  }

  // Footer
  const [message, setMessage] = useState("");
  const [sendEnable, setSendEnable] = useState(false);
  const [imageData, setImageData] = useState(null);

  const onchange = (value) => {
    setMessage(value);
    setSendEnable(true);
    if (value === "") {
      setSendEnable(false);
    }
  };

  const pick = async () => {
    const data = await pickImage();
    if (data) {
      setImageData(data);
      console.log("Image in chats : ", data);
      setSendEnable(true);
    }
  };

  const cameraPick = async () => {
    const data = await pickCamera();
    if (data) {
      setImageData(data);
      console.log("Image in chats : ", data);
      setSendEnable(true);
    }
  };

  const uploadChatImage = async () => {
    const name = `${Math.random().toString(36).substring(1)}`;
    const response = await fetch(imageData.uri);
    const blob = await response.blob();
    const storageRef = ref(
      FirebaseStorage,
      `ChatsImages/${chatRoomID}/${name}/`
    );
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Uploading Image : " + progress + "% done");
    });

    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const sendMessage = async () => {
    let imageURL = ""; // initialize imageURL as an empty string
    if (imageData) {
      // if there's an image to upload
      imageURL = await uploadChatImage(); // upload the image and get the URL
    }
    let chatRoomID;
    if (user < friend) {
      chatRoomID = `${user}_${friend}`;
    } else {
      chatRoomID = `${friend}_${user}`;
    }

    const newMessage = {
      text: message,
      image: imageURL,
      fileType: imageData ? imageData.type : "",
      sender: user,
      createdAt: new Date(),
    };
    
    // const chatRoomRef = doc(FirestoreDB, "chatRooms", chatRoomID);
    const messageRef = collection(FirestoreDB, "chatRooms", chatRoomID, "Messages");
    await addDoc(messageRef, newMessage);

    // await updateDoc(chatRoomRef, {
    //   Messages: arrayUnion(newMessage),
    // });

    setSendEnable(false);
    setMessage("");
    setImageData(null);
  };

  // Body

  const scrollViewRef = useRef();
  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const UserMessageView = (message, time, key, file, fileType) => {
    return (
      <View style={styles.userContainer} key={key}>
        <View style={styles.InneruserContainer}>
          {fileType === "jpeg" && (
            <Image source={{ uri: file }} style={styles.imageinChat} />
          )}
          {fileType === "mp4" && (
            <Video
              style={styles.imageinChat}
              source={{ uri: file }}
              isMuted={false}
              resizeMode="cover"
              shouldPlay={false}
              useNativeControls={true}
            />
          )}
          {message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.info}>
            <Text style={styles.time}>
              <Text style={styles.time}>
                {time &&
                  new Date(parseInt(time) * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
              </Text>
            </Text>
            <FontAwesome
              name="check-circle"
              size={15}
              color="#00b300"
              style={styles.checkIcon}
            />
          </View>
        </View>
      </View>
    );
  };
  const OtherUserMessageView = (message, time, key, file, fileType) => {
    return (
      <View style={styles.otherUserContainer} key={key}>
        <View style={styles.InnerOtherUserContainer}>
          {fileType === "jpeg" && (
            <Image source={{ uri: file }} style={styles.imageinChat} />
          )}
          {fileType === "mp4" && (
            <Video
              style={styles.imageinChat}
              source={{ uri: file }}
              isMuted={false}
              resizeMode="cover"
              shouldPlay={false}
              useNativeControls={true}
            />
          )}

          {message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.OtherUserTime}>
            <Text style={styles.time}>
              {time &&
                new Date(parseInt(time) * 1000).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const [MessageData, setMessageData] = useState([]); //used cachedData instead of MessageData
  // const [cachedData, setCachedData] = useState([]);
  useLayoutEffect(() => {
    // const chatRoomRef = doc(FirestoreDB, "chatRooms", chatRoomID);

    // const unsubscribe = onSnapshot(chatRoomRef, async (doc) => {
    //   if (doc.exists()) {
    //     const data = doc.data().Messages;
    //     setMessageData(data);
    //     // await AsyncStorage.setItem(chatRoomID, JSON.stringify(data));
    //     console.log("MessageData : ", data);
    //   } else {
    //     console.log("No such document!");
    //   }
    //   // const cachedChats = await AsyncStorage.getItem(chatRoomID);
    //   // setCachedData(cachedChats ? JSON.parse(cachedChats) : []);
    // });
    // return () => unsubscribe();

    const messageRef = query(
      collection(FirestoreDB, "chatRooms", chatRoomID, "Messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(messageRef, async (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setMessageData(data);
      // console.log("MessageData : ", data);
    });
    return () => unsubscribe();
  }, [FirestoreDB, chatRoomID]);

  return (
    <>
      <ImageBackground source={wallpaper} style={styles.wall}>
        {/* header */}

        <View style={styles.container}>
          <View style={styles.Headercontainer}>
            <View style={styles.left}>
              <Feather
                style={styles.BackIcon}
                name="arrow-left"
                size={20}
                color="white"
                onPress={() => navigation.goBack()}
              />
              <Image style={styles.profile} source={{ uri: data.profilePic }} />
              <Text style={styles.title}>
                {data.fullName.lenght > 10
                  ? `${data.fullName.slice(0, 10)}..`
                  : data.fullName}
              </Text>
            </View>
            <View style={styles.right}>
              <Feather
                style={styles.icon}
                name="video"
                size={19}
                color="white"
              />
              <Feather
                style={styles.icon}
                name="phone"
                size={19}
                color="white"
              />
              <Feather
                style={styles.icon}
                name="more-vertical"
                size={20}
                color="white"
              />
            </View>
          </View>
        </View>

        {/* Body */}

        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={scrollToBottom}
          onScroll={handleScroll}
        >
          {/* Messages to be render here */}
          {MessageData.map((message, index) => {
            if (message.sender === user) {
              return UserMessageView(
                message.text,
                message.createdAt.seconds,
                index,
                message.image,
                message.fileType
              );
            }
            if (message.sender === friend) {
              // console.log("Message : ", message);
              return OtherUserMessageView(
                message.text,
                message.createdAt.seconds,
                index,
                message.image,
                message.fileType
              );
            }
          })}
        </ScrollView>
        {showScrollIcon && (
          <View style={styles.scroll}>
            <Feather
              onPress={scrollToBottom}
              name="chevrons-down"
              size={22}
              color="#fff"
            />
          </View>
        )}

        {/* Footer */}

        <View style={styles.Bcontainer}>
          <View style={styles.Bleft}>
            <View style={styles.inputContainer}>
              <Feather name="smile" size={20} color="black" />
              <TextInput
                placeholder="Message"
                multiline={true}
                style={styles.txtInput}
                onChangeText={(value) => onchange(value)}
                value={message}
              />
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={pick}>
                <Feather name="paperclip" size={20} color="black" />
              </TouchableOpacity>
              {!sendEnable && (
                <>
                  <FontAwesome
                    name="rupee"
                    size={20}
                    color="black"
                    style={styles.Bicons}
                  />
                  <TouchableOpacity onPress={cameraPick}>
                    <Feather
                      name="camera"
                      size={20}
                      color="black"
                      style={styles.Bicons}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
          <View style={styles.Bright}>
            {sendEnable ? (
              <Feather
                name="send"
                size={20}
                color="white"
                onPress={sendMessage}
              />
            ) : (
              <Feather name="mic" size={20} color="white" />
            )}
          </View>
        </View>
      </ImageBackground>
    </>
  );
};
export default ChatPage;
const styles = StyleSheet.create({
  wall: {
    flex: 1,
    justifyContent: "space-between",
  },
  profile: {
    height: 40,
    width: 40,
    borderRadius: 25,
  },
  Headercontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingTop: 50,
    backgroundColor: "#0e806a",
    paddingTop: 10,
    borderRadius: 15,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    paddingHorizontal: 12,
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

  // Footer
  Bcontainer: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
  Bleft: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    backgroundColor: "#f2f2f2",
    borderRadius: 30,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  Bright: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#53d57e",
  },
  txtInput: {
    fontSize: 16,
    marginLeft: 9,
    paddingVertical: 10,
    maxWidth: "80%",
    minWidth: "57%",
  },
  Bicons: {
    paddingLeft: 15,
  },

  // Body
  userContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  otherUserContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  InneruserContainer: {
    flexDirection: "column",
    backgroundColor: "#e5f5d6",
    paddingTop: 10,
    paddingHorizontal: 10,
    margin: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    maxWidth: "60%",
  },
  imageinChat: {
    width: 180,
    height: 180,
    borderRadius: 35,
  },
  InnerOtherUserContainer: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 5,
    margin: 10,
    padding: 10,
    paddingBottom: 0,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    maxWidth: "60%",
  },
  message: {
    fontSize: 15,
  },
  OtherUserTime: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 10,
  },
  time: {
    fontSize: 11,
    color: "#808080",
    marginBottom: 3,
  },
  info: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  checkIcon: {
    marginLeft: 8,
  },
  scroll: {
    position: "absolute",
    bottom: 65,
    right: 10,
    backgroundColor: "#53d57e",
    borderRadius: 50,
    padding: 5,
  },
});

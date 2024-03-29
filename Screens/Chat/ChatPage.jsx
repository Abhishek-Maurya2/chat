import {
  ImageBackground,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Pressable,
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
  addDoc,
  collection,
  query,
} from "firebase/firestore";
import { pickCamera, pickImage } from "../../components/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";
import { Colors } from "../../components/Colors";
import ChatsImageModal from "../../components/ChatsImageModal";
import { ActivityIndicator } from "react-native-paper";

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

  const scrollViewRef = useRef();
  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
    const messageRef = collection(
      FirestoreDB,
      "chatRooms",
      chatRoomID,
      "Messages"
    );
    await addDoc(messageRef, newMessage);

    // await updateDoc(chatRoomRef, {
    //   Messages: arrayUnion(newMessage),
    // });

    setLoading(false);
    setSendEnable(false);
    setMessage("");
    setImageData(null);
  };

  // Body

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handlePress = (image, name, time, message) => {
    const item = { image, name, time, message };
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const UserMessageView = (message, time, key, file, fileType, name) => {
    return (
      <View style={styles.userContainer} key={key}>
        <View style={styles.InneruserContainer}>
          {fileType === "jpeg" && (
            <Pressable onPress={() => handlePress(file, name, time, message)}>
              <Image
                source={{ uri: file }}
                style={styles.imageinChat}
                resizeMode="contain"
              />
            </Pressable>
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
  const OtherUserMessageView = (message, time, key, file, fileType, name) => {
    return (
      <View style={styles.otherUserContainer} key={key}>
        <View style={styles.InnerOtherUserContainer}>
          {fileType === "jpeg" && (
            <Pressable onPress={() => handlePress(file, name, time, message)}>
              <Image source={{ uri: file }} style={styles.imageinChat} />
            </Pressable>
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

  const [MessageData, setMessageData] = useState([]);
  useLayoutEffect(() => {
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
            <Pressable
              style={styles.left}
              onPress={() => {
                navigation.navigate("Profile", { chatId: data });
              }}
            >
              <Feather
                style={styles.BackIcon}
                name="arrow-left"
                size={20}
                color="black"
                onPress={() => navigation.goBack()}
              />
              <Image style={styles.profile} source={{ uri: data.profilePic }} />
              <Text style={styles.title}>
                {data.fullName.lenght > 10
                  ? `${data.fullName.slice(0, 10)}..`
                  : data.fullName}
              </Text>
            </Pressable>
            <View style={styles.right}>
              <Feather name="video" size={20} color="black" />
              <Feather
                style={{ paddingLeft: 30 }}
                name="phone"
                size={20}
                color="black"
              />
              <Feather
                style={{ paddingLeft: 20 }}
                name="more-vertical"
                size={20}
                color="black"
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
                message.fileType,
                data.fullName
              );
            }
            if (message.sender === friend) {
              // console.log("Message : ", message);
              return OtherUserMessageView(
                message.text,
                message.createdAt.seconds,
                index,
                message.image,
                message.fileType,
                data.fullName
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

        <View style={styles.Footer}>
          <View style={styles.privewPane}>
            {imageData && (
              <Image
                source={{ uri: imageData.uri }}
                style={styles.privewImage}
                resizeMode="contain"
              />
            )}
          </View>
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
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : sendEnable ? (
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
        </View>
      </ImageBackground>
      {isModalVisible && (
        <ChatsImageModal
          item={selectedItem}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      )}
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
    paddingTop: 4,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.background,
    borderRadius: 15,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    borderColor: "#b8bab89f",
    borderBottomWidth: 0.6,
    borderLeftWidth: 0.6,
    borderRightWidth: 0.6,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
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

  // Footer
  Footer: {
    backgroundColor: "white",
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
  privewPane: {
    alignItems: "center",
    justifyContent: "center",
  },
  privewImage: {
    width: "100%",
    height: 400,
  },
  Bcontainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  //body
  userContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  InneruserContainer: {
    flexDirection: "column",
    maxWidth: "60%",
    backgroundColor: "#e8fbce",
    borderRadius: 15,
  },
  imageinChat: {
    width: 200,
    height: 200,
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  message: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  time: {
    fontSize: 12,
    color: "#676767",
  },
  checkIcon: {
    paddingLeft: 5,
  },
  OtherUserTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 2,
  },
  otherUserContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  InnerOtherUserContainer: {
    flexDirection: "column",
    maxWidth: "60%",
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  scroll: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#53d57e",
    padding: 3,
    borderRadius: 50,
  },
});

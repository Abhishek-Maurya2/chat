import {
  ImageBackground,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import React, { useState, useRef, useLayoutEffect } from "react";
import wallpaper from "./../../assets/images/wall.jpg";

import { Feather, FontAwesome } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

import { FirestoreDB, FirebaseAuth } from "./../../Auth/FirebaseConfig";

import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  Firestore,
} from "firebase/firestore";


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

  // Footer
  const [message, setMessage] = useState("");
  const [sendEnable, setSendEnable] = useState(false);

  const onchange = (value) => {
    setMessage(value);
    setSendEnable(true);
    if (value === "") {
      setSendEnable(false);
    }
  };

  const sendMessage = async () => {
    let chatRoomID;
    if (user < friend) {
      chatRoomID = `${user}_${friend}`;
    } else {
      chatRoomID = `${friend}_${user}`;
    }
    const chatRoomRef = doc(FirestoreDB, "chatRooms", chatRoomID);
    
    const newMessage = {
      text: message,
      sender: user,
      createdAt: new Date(),
    };

    await updateDoc(chatRoomRef, {
      Messages: arrayUnion(newMessage),
    });
    
    setSendEnable(false);
    setMessage("");
  };
  
  // Body

  const scrollViewRef = useRef();
  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const UserMessageView = (message, time) => {
    return (
      <View style={styles.userContainer}>
        <View style={styles.InneruserContainer}>
          <Text style={styles.message}>{message}</Text>
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
  const OtherUserMessageView = (message, time) => {
    return (
      <View style={styles.otherUserContainer}>
        <View style={styles.InnerOtherUserContainer}>
          <Text style={styles.message}>{message}</Text>
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
    );
  };

  const [MessageData, setMessageData] = useState([]);
  useLayoutEffect(() => {
    let chatRoomID;
    if (user < friend) {
      chatRoomID = `${user}_${friend}`;
    } else {
      chatRoomID = `${friend}_${user}`;
    }
    const chatRoomRef = doc(FirestoreDB, "chatRooms", chatRoomID);

    const unsubscribe = onSnapshot(chatRoomRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data().Messages;
        setMessageData(data);
        // console.log("MessageData : ", data);
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, []);
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
              <Image
                style={styles.profile}
                source={{uri : data.profilePic}}
              />
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
              return UserMessageView(message.text, message.createdAt.seconds);
            } if(message.sender === friend) {
              return OtherUserMessageView(
                message.text,
                message.createdAt.seconds
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
              <Feather name="paperclip" size={20} color="black" />
              {!sendEnable && (
                <>
                  <FontAwesome
                    name="rupee"
                    size={20}
                    color="black"
                    style={styles.Bicons}
                  />
                  <Feather
                    name="camera"
                    size={20}
                    color="black"
                    style={styles.Bicons}
                  />
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
    borderRadius: 15,
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
    paddingHorizontal: 13,
    paddingVertical: 3,
    margin: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    maxWidth: "60%",
  },
  InnerOtherUserContainer: {
    flexDirection: "column",
    backgroundColor: "#fff",
    paddingHorizontal: 13,
    paddingVertical: 3,
    borderRadius: 5,
    margin: 10,
    marginVertical: 5,
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    maxWidth: "60%",
  },
  message: {
    fontSize: 15,
  },
  time: {
    fontSize: 11,
    color: "#808080",
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

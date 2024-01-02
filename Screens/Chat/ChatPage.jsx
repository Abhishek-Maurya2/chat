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

import { firestoreDB } from "./../../Auth/FirebaseConfig";
// import { useSelector } from "react-redux";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";

import { MessageData } from "./MessageData";

const ChatPage = () => {
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

  const navigation = useNavigation();

  // Footer
  const [message, setMessage] = useState("");
  const [sendEnable, setSendEnable] = useState(false);
  // const user = useSelector((state) => state.userAuth.user);

  const onchange = (value) => {
    setMessage(value);
    setSendEnable(true);
    if (value === "") {
      setSendEnable(false);
    }
  };

  const sendMessage = async () => {
    setSendEnable(false);
    // const timeStamp = serverTimestamp();
    // const id = `${Date.now()}`;
    // const _doc = {
    //   _id: id,
    //   roomId: room._id,
    //   timeStamp: timeStamp,
    //   message: message,
    //   user: user,
    // };
    setMessage("");
    // await addDoc(
    //   collection(doc(firestoreDB, "chats", room._id), "messages"),
    //   _doc
    // )
    //   .then(() => {})
    //   .catch((err) => alert(err));
  };

  // Body

  const [messages, setMessages] = useState(null);

  // useLayoutEffect(() => {
  //   const msgQuery = query(
  //     collection(firestoreDB, "chats", room?._id, "messages"),
  //     orderBy("timeStamp", "asc")
  //   );
  //   const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
  //     const upMsg = querySnap.docs.map((doc) => doc.data());
  //     setMessages(upMsg);
  //   });
  // });

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
                source={require("./../../assets/images/1.png")}
              />
              <Text style={styles.title}>
                {/* {room.chatName.lenght > 10
                  ? `${room.chatName.slice(0, 10)}..`
                  : room.chatName} */}
                Chat Name
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
          {/* <View>
            {messages?.map((msg, i) => {
              if (msg.user.providerData.email === user.providerData.email) {
                return (
                  <View key={i}>
                    {UserMessageView("Message", "1000000")}
                  </View>
                );
              } else {
                return (
                  <View key={i}>
                    {OtherUserMessageView("Message", "1000000")}
                  </View>
                );
              }
            })}
          </View> */}
          <View>
            {MessageData.map((msg) => {
              if (msg.id === "1") {
                return UserMessageView(msg.message, msg.time);
              } else {
                return OtherUserMessageView(msg.message, msg.time);
              }
            })}
          </View>
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

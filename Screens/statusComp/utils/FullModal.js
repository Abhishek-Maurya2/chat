import { View, StyleSheet, Modal, Image, Text } from "react-native";
import React from "react";
import ProgresBar from "./ProgresBar";
import { Feather } from "@expo/vector-icons";
import { Video } from "expo-av";

const FullModal = (props) => {
  const { isModalVisible, setIsModalVisible, item, setTimeUp } = props;

  const updateModalStatus = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      visible={isModalVisible}
      onRequestClose={updateModalStatus}
    >
      <View style={styles.container}>
        <ProgresBar setTimeUp={setTimeUp} />
        <View style={styles.topContainer}>
          <View style={styles.profileSection}>
            <Feather
              name="arrow-left"
              size={24}
              color={"white"}
              onPress={() =>
                setIsModalVisible((prev) => {return !prev})
              }
            />
            <Image
              source={{ uri: item.profilePic }}
              style={styles.profileImg}
            />
            <Text style={styles.username}>{item.fullName}</Text>
          </View>
          <Feather name="more-vertical" color={"white"} size={18} />
        </View>
        {item.statusType == "jpeg" && (
          <Image source={{ uri: item.status }} style={styles.storyImg} />
        )}
        {item.statusType == "mp4" && (
          <Video
            source={{ uri: item.status }}
            style={styles.storyImg}
            resizeMode="cover"
            shouldPlay={true}
            isLooping={true}
          />
        )}
        <Text style={styles.storyMsg}>{item.storyMsg}</Text>
        <View style={styles.replySection}>
          <Feather
            name="corner-left-down"
            color={"white"}
            size={24}
            onPress={() =>
              setIsModalVisible((prev) => ({ ...prev, [item.id]: false }))
            }
          />
          <Text style={styles.reply}>Reply</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  storyImg: {
    height: "75%",
    width: "100%",
  },
  storyMsg: {
    fontSize: 17,
    color: "white",
    textAlign: "center",
  },
  container: {
    backgroundColor: "#232d36",
    height: "100%",
    justifyContent: "space-between",
  },
  profileImg: {
    height: 40,
    width: 40,
    borderRadius: 50,
  },
  username: {
    fontSize: 17,
    color: "white",
    marginLeft: 10,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  reply: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  replySection: {
    alignItems: "center",
  },
});

export default FullModal;

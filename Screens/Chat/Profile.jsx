import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Avatar, Button, IconButton } from "react-native-paper";
import { Colors } from "../../components/Colors";
import ViewModal from "../../components/ViewModal";
import { Feather } from "@expo/vector-icons";
import { Follow, UnFollow } from "../../components/Functionality";
import { FirebaseAuth, FirestoreDB } from "../../Auth/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Profile = ({ route }) => {
  let CurrentUser = FirebaseAuth.currentUser.uid;
  const data = route.params.chatId;
  const navigation = useNavigation();




  const [followings, setFollowings] = useState(false);

 useEffect(() => {
  const checkFollow = async() => {
    const ref = doc(FirestoreDB, "Posts", data.id);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      if (docSnap.data().Followers.includes(CurrentUser)) {
        setFollowings(true);
      } else {
        setFollowings(false);
      }
    }
  }
  checkFollow();
 })






  const handleFollow = async (data) => {
    const x = followings ? await UnFollow(data) : await Follow(data);
    setFollowings(x);
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handlePress = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const IconButtonWithLabel = ({
    icon,
    label,
    onPress,
    size = 25,
    color = "black",
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,
        marginTop: 20,
        padding: 10,
        borderWidth: 0.3,
        borderColor: "#808080a6",
        borderRadius: 12,
        minWidth: 70,
        minHeight: 70,
      }}
      android_ripple={{ color: "#808080a1" }}
    >
      <Feather name={icon} size={size} color={color} />
      <Text style={{ marginTop: 5 }}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={styles.container}>
      <View style={styles.navs}>
        <IconButton
          icon="arrow-left"
          size={25}
          iconColor="black"
          onPress={() => navigation.goBack()}
        />
        <IconButton icon="dots-vertical" size={25} iconColor="black" />
      </View>
      <View style={styles.box}>
        <View style={styles.top}>
          <View style={styles.profileSection}>
            <Pressable onPress={() => handlePress(data)}>
              <Avatar.Image
                size={100}
                source={{
                  uri: data.profilePic,
                }}
              />
            </Pressable>
            <View style={styles.infoContainer}>
              <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                {data.fullName}
              </Text>
              <Text style={{ fontSize: 15, marginTop: 5 }}>
                +91 {data.PhoneNumber}
              </Text>
            </View>
            <View style={styles.followSection}>
              {followings ? (
                <Pressable
                  onPress={() => handleFollow(data)}
                  android_ripple={{ color: "#808080a1" }}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 0.3,
                    borderColor: "#808080a6",
                    borderRadius: 20,
                    flexDirection: "row",
                    padding: 10,
                  }}
                >
                  <Feather name="user-check" size={20} color="black" />
                  <Text style={{ marginLeft: 5 }}>Following</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleFollow(data)}
                  android_ripple={{ color: "#808080a1" }}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 0.3,
                    borderColor: "#808080a6",
                    borderRadius: 20,
                    flexDirection: "row",
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    backgroundColor: Colors.primary,
                  }}
                >
                  <Feather name="user-plus" size={20} color="white" />
                  <Text style={{ marginLeft: 8, color: "white" }}>Follow</Text>
                </Pressable>
              )}
            </View>
          </View>
          <View style={styles.optionsSection}>
            <IconButtonWithLabel
              icon="message-square"
              label="Message"
              color={Colors.primary}
            />
            <IconButtonWithLabel
              icon="video"
              label="Video"
              color={Colors.primary}
            />
            <IconButtonWithLabel
              icon="phone"
              label="Audio"
              size={23}
              color={Colors.primary}
            />
            <IconButtonWithLabel
              icon="search"
              label="Search"
              color={Colors.primary}
            />
          </View>
        </View>
        <View style={styles.bioSection}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Bio</Text>
          <Text style={{ fontSize: 15, color: "grey", marginTop: 5 }}>
            This is a Bio of the user. This is a Bio of the user. This is a Bio
            of the user.
          </Text>
        </View>
      </View>
      {isModalVisible && (
        <ViewModal
          item={selectedItem}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  navs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  box: {
    flex: 1,
    borderRadius: 15,
    marginHorizontal: 15,
  },
  top: {
    backgroundColor: Colors.background,
    borderRadius: 15,
    padding: 10,
    borderColor: "#b8bab89f",
    borderWidth: 0.7,
  },
  profileSection: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  infoContainer: {
    marginLeft: 10,
    marginTop: 15,
  },
  followSection: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  optionsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  bioSection: {
    backgroundColor: Colors.background,
    marginTop: 10,
    borderRadius: 15,
    padding: 10,
    borderColor: "#b8bab89f",
    borderWidth: 0.5,
  },
});

import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { StatusData } from "./StatusData";
import FullModal from "./utils/FullModal";

const RecentStatus = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePress = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const setTimeUp = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.recent}>
        {StatusData.map((item) => (
          <Pressable key={item.id} onPress={() => handlePress(item)}>
            <View style={styles.boxUi}>
              <ImageBackground
                source={item.statusImg}
                blurRadius={10}
                style={styles.backgroundImage}
              >
                <View style={styles.imgStory}>
                  <Image source={item.profileImg} style={styles.statusStyle} />
                </View>
                <Text style={styles.userName}>{item.name}</Text>
              </ImageBackground>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      {isModalVisible && (
        <FullModal
          item={selectedItem}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          setTimeUp={setTimeUp}
        />
      )}
    </View>
  );
};

export default RecentStatus;
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  statusStyle: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  recentUpdates: {
    fontSize: 15,
    fontWeight: "500",
    color: "#777",
  },
  imgStory: {
    height: 42,
    width: 42,
    borderColor: "#25D366",
    borderWidth: 2,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "400",
    color: "#fff",
    maxWidth: 85,
    textAlign: "center",
  },
  boxUi: {
    margin: 8,
    borderColor: "#777",
    borderWidth: 1,
    borderRadius: 10,
    width: 100,
    height: 150,
    alignItems: "center",
    overflow: "hidden",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  recent: {},
});

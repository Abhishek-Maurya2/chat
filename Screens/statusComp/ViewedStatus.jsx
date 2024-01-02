import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { StatusData } from "./StatusData";
import FullModal from "./utils/FullModal";

const ViewwdStatus = () => {
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
          <TouchableOpacity
            style={styles.boxUi}
            key={item.id}
            onPress={() => handlePress(item)}
          >
            <ImageBackground
              source={item.statusImg}
              blurRadius={15}
              style={styles.backgroundImage}
            >
              
                <Image source={item.profileImg} style={styles.statusStyle} />
              
              <Text style={styles.userName}>{item.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
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

export default ViewwdStatus;
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
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
    borderColor: "grey",
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
});

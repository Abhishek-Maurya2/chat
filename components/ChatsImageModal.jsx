import {
  View,
  StyleSheet,
  Modal,
  Image,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Video } from "expo-av";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ChatsImageModal = (props) => {
  const scale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = event.scale * ctx.startScale;
    },
    onEnd: (_) => {
      // scale.value = withSpring(1);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const [isFocus, setIsFocus] = useState(true);
  const { isModalVisible, setIsModalVisible, item } = props;

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
        <Pressable onPress={() => setIsFocus(!isFocus)} style={styles.box}>
          {isFocus && (
            <View style={styles.top}>
              <View style={styles.topContainer}>
                <View style={styles.profileSection}>
                  <Feather
                    name="arrow-left"
                    size={24}
                    color={"white"}
                    onPress={() =>
                      setIsModalVisible((prev) => {
                        return !prev;
                      })
                    }
                    style={{ marginRight: 10 }}
                  />
                  <View style={styles.infoContainer}>
                    <View>
                      <Text style={styles.username}>{item.name}</Text>
                    </View>
                    <View>
                      <Text style={{ color: "white", fontSize: 12 }}>
                        {item.time &&
                          new Date(
                            parseInt(item.time) * 1000
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actionSection}>
                  <Feather name="more-vertical" size={20} color={"white"} />
                </View>
              </View>
            </View>
          )}
          <GestureHandlerRootView>
            <View style={styles.imgContainer}>
              <PinchGestureHandler onGestureEvent={pinchHandler}>
                <Animated.View style={rStyle}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.img}
                    resizeMode="contain"
                  />
                </Animated.View>
              </PinchGestureHandler>
            </View>
          </GestureHandlerRootView>
          {isFocus && (
            <View style={styles.bottom}>
              <View style={styles.bottomContainer}>
                <View style={styles.bottomSection}>
                  <Feather name="message-circle" size={22} color={"white"} />
                  <Text style={{ color: "white", marginLeft: 10 }}>Reply</Text>
                </View>
                <View style={styles.bottomSection}>
                  <Text style={{ color: "white" }}>{item.message}</Text>
                </View>
                <View style={styles.bottomSection}>
                  <Feather name="share" size={22} color={"white"} />
                  <Text style={{ color: "white", marginLeft: 10 }}>Share</Text>
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242624",
  },
  box: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  top: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#1f1f1fcc",
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingBottom: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  img: {
    width: width,
    height: width,
  },
  imgContainer: {
    width: width,
    height: width,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#1f1f1fcc",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 18,
    marginTop: 15,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionSection: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ChatsImageModal;

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

const ViewModal = (props) => {
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
                      setIsModalVisible((prev) => ({
                        ...prev,
                        [item.id]: false,
                      }))
                    }
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.username}>{item.fullName}</Text>
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
                    source={{ uri: item.profilePic }}
                    style={styles.img}
                    resizeMode="contain"
                  />
                </Animated.View>
              </PinchGestureHandler>
            </View>
          </GestureHandlerRootView>
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
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  img: {
    width: width,
    height: width,
  },
});

export default ViewModal;

import React, { useCallback, useState } from "react";
import { View, Text, Dimensions, Pressable, Image } from "react-native";
import { Video } from "expo-av";
import Feather from "react-native-vector-icons/Feather";
import Ionic from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

const VideoCard = ({ item, index, currentIndex }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [isFocused, setIsFocused] = useState(false);
  const [mute, setMute] = useState(false);
  const [like, setLike] = useState(item.isLike);

  const onBuffer = (buffer) => {
    console.log("buffring", buffer);
  };
  const onError = (error) => {
    console.log("error", error);
  };

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  return (
    <View
      style={{
        width: windowWidth,
        height: windowHeight,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        activeOpacity={0.9}
        onPress={() => setMute(!mute)}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      >
        <Video
          onLoad={onBuffer}
          onError={onError}
          isLooping={true}
          resizeMode="cover"
          shouldPlay={isFocused && currentIndex === index ? true : false}
          source={item.src}
          isMuted={mute}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />
      </Pressable>
      <Ionic
        name="volume-mute"
        style={{
          fontSize: mute ? 20 : 0,
          color: "white",
          position: "absolute",
          backgroundColor: "rgba(52,52,52,0.6)",
          borderRadius: 100,
          padding: mute ? 20 : 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: windowWidth,
          zIndex: 1,
          bottom: 0, //edited
          padding: 10,
        }}
      >
        <View style={{ position: "absolute", bottom: 80 }}>
          <Pressable style={{ width: 150 }}>
            <View
              style={{ width: 100, flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 100,
                  backgroundColor: "white",
                  margin: 10,
                }}
              >
                <Image
                  source={{
                    uri: "https://www.w3schools.com/w3images/avatar2.png",
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "cover",
                    borderRadius: 100,
                  }}
                />
              </View>
              <Text style={{ color: "white", fontSize: 16 }}>{item.user}</Text>
            </View>
          </Pressable>
          <Text style={{ color: "white", fontSize: 14, marginHorizontal: 10 }}>
            {item.description}
          </Text>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <Ionic
              name="ios-musical-note"
              style={{ color: "white", fontSize: 16 }}
            />
            <Text style={{ color: "white" }}>Original Audio</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 80, //edited
          right: 0,
        }}
      >
        <Pressable onPress={() => setLike(!like)} style={{ padding: 10 }}>
          <AntDesign
            name={like ? "heart" : "hearto"}
            style={{ color: like ? "red" : "white", fontSize: 25 }}
          />
          <Text style={{ color: "white" }}>{item.likes}</Text>
        </Pressable>
        <Pressable style={{ padding: 10 }}>
          <Ionic
            name="ios-chatbubble-outline"
            style={{ color: "white", fontSize: 25 }}
          />
        </Pressable>
        <Pressable style={{ padding: 10 }}>
          <Ionic
            name="paper-plane-outline"
            style={{ color: "white", fontSize: 25 }}
          />
        </Pressable>
        <Pressable style={{ padding: 10 }}>
          <Feather
            name="more-vertical"
            style={{ color: "white", fontSize: 25 }}
          />
        </Pressable>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "white",
            margin: 10,
          }}
        >
          <Image
            source={{ uri: "https://www.w3schools.com/w3images/avatar2.png" }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
              resizeMode: "cover",
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default VideoCard;

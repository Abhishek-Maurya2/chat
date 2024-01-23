import { View, Text, FlatList } from "react-native";
import React, { useState } from "react";
import VideoCard from "./VideoCard";
import SwiperFlatList from "react-native-swiper-flatlist";
import { data } from "./data";
const ReelsComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChangeIndexValue = ({ index }) => {
    setCurrentIndex(index);
  };
  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <SwiperFlatList
        vertical={true}
        onChangeIndex={handleChangeIndexValue}
        data={data}
        renderItem={({ item, index }) => (
          <VideoCard item={item} index={index} currentIndex={currentIndex} />
        )}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
};

export default ReelsComponent;

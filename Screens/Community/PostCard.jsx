import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "react-native-paper";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Colors } from "../../components/Colors";
import {
  commentPost,
  getUserById,
  likePost,
  unlikePost,
} from "../../components/Functionality";
import { FirebaseAuth } from "../../Auth/FirebaseConfig";
import RBSheet from "react-native-raw-bottom-sheet";

const PostCard = ({ postData }) => {
  const currentAuthUser = FirebaseAuth.currentUser;
  const x = postData;
  // console.log(x);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      const data = await getUserById(x.createdBy);
      await setUserData(data);
    };
    getUser();
    // console.log(userData);
  }, []);

  //   LIKE
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = async () => {
    if (isLiked) {
      await unlikePost(x.id);
      setIsLiked(false);
    } else {
      await likePost(x.id);
      setIsLiked(true);
    }
  };
  useEffect(() => {
    const checkLike = () => {
      //if uid in likes array
      if (x.likes.includes(currentAuthUser.uid)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    };
    checkLike();
  }, []);

  //  COMMENT
  const refRBSheet = useRef();
  const [comment, setComment] = useState("");
  const handleComment = async () => {
    await commentPost(x.id, comment);
    setComment("");
    refRBSheet.current.close();
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.avatar}>
            <Avatar.Image size={40} source={{ uri: userData.profilePic }} />
          </Pressable>
          <View style={styles.profileContainer}>
            <Text style={styles.profileName}>{userData.fullName}</Text>
            <Text style={styles.timeText}>
              {x.createdAt.toDate().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
        <View style={styles.profileRight}>
          <Feather name="more-horizontal" size={24} color="black" />
        </View>
      </View>
      <View style={styles.postContent}>
        <Image source={{ uri: x.image }} style={styles.postMedia} />
      </View>
      <View style={styles.footerContainer}>
        <View style={styles.footerIconContainer}>
          <View style={styles.footerIconLeft}>
            <Pressable onPress={handleLike}>
              {isLiked ? (
                <AntDesign
                  name="heart"
                  size={26}
                  color="#e81135"
                  style={styles.reactionIcons}
                />
              ) : (
                <AntDesign
                  name="hearto"
                  size={26}
                  color="black"
                  style={styles.reactionIcons}
                />
              )}
            </Pressable>
            <Feather
              name="message-circle"
              size={26}
              color="black"
              style={styles.reactionIcons}
            />
            <Feather name="send" size={26} color="black" />
          </View>
          <View style={styles.footerIconRight}>
            <Feather name="bookmark" size={26} color="black" />
          </View>
        </View>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>{x.caption}</Text>
        </View>
        {x.comments.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 10,
            }}
          >
            <Pressable onPress={() => refRBSheet.current.open()}>
              {x.comments.length > 0 && (
                <Text style={{}}>{x.comments[0].comment}</Text>
              )}
            </Pressable>
            <Text style={{ color: "grey", fontSize: 12 }}>
              {x.comments &&
                x.comments[0] &&
                x.comments[0].commentedAt &&
                x.comments[0].commentedAt.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </Text>
          </View>
        )}
        <Pressable onPress={() => refRBSheet.current.open()}>
          <Text style={styles.commentsText}>Add Comment</Text>
        </Pressable>
      </View>

      <RBSheet
        height={500}
        ref={refRBSheet}
        nestedScrollEnabled={true}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "#00000089",
          },
          draggableIcon: {
            backgroundColor: "#d5d5d5",
          },
          container: {
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            borderWidth: 0.5,
            borderColor: "#808080a6",
          },
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginBottom: 10,
              marginHorizontal: 20,
            }}
          >
            Comments
          </Text>
            <FlatList
            nestedScrollEnabled={true}
              keyExtractor={(item) => item.commentedAt.seconds}
              height={330}
              data={x.comments}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, maxWidth: "80%" }}>
                    {item.comment}
                  </Text>
                  <Text style={{ color: "grey", fontSize: 12 }}>
                    {item.commentedAt &&
                      item.commentedAt.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </Text>
                </View>
              )}
            />
          <View style={{}}>
            <TextInput
              placeholder="Add Comment"
              multiline={true}
              numberOfLines={2}
              onChangeText={(text) => setComment(text)}
              style={{
                marginVertical: 15,
                marginHorizontal: 20,
                backgroundColor: "#9897974e",
                borderRadius: 30,
                paddingHorizontal: 20,
                fontSize: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <Pressable
              android_ripple={{ color: "grey" }}
              onPress={handleComment}
              style={{
                paddingVertical: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.primary,
                borderRadius: 30,
                marginHorizontal: 20,
                paddingHorizontal: 20,
                alignSelf: "flex-end",
                flexDirection: "row",
              }}
            >
              <Feather name="send" size={18} color="white" />
              <Text style={{ color: "white", fontSize: 15, paddingLeft: 7 }}>
                Post
              </Text>
            </Pressable>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default PostCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {},
  profileContainer: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  profileTime: {
    fontSize: 12,
  },
  profileRight: {},
  postContent: {},
  postMedia: {
    width: "100%",
    height: 400,
  },
  footerContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: "#808080ae",
    borderBottomWidth: 0.3,
  },
  footerIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  footerIconLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerIconRight: {
    //nothing yet
  },
  reactionIcons: {
    marginRight: 15,
  },
  description: {
    marginTop: 5,
  },
  descriptionText: {
    fontSize: 15,
  },
  comments: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    borderWidth: 0.5,
  },
  commentsText: {
    fontSize: 11,
    color: "#808080",
    marginBottom: 5,
  },
  timeText: {
    fontSize: 12,
    color: "#808080",
  },
});

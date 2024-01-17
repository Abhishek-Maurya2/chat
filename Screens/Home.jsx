import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/navigation";
import { Feather } from "@expo/vector-icons";

import {
  FirebaseAuth,
  FirebaseStorage,
  FirestoreDB,
} from "../Auth/FirebaseConfig";
import { pickCamera, pickImage } from "../components/User";
import { Colors } from "../components/Colors";

import RBSheet from "react-native-raw-bottom-sheet";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { ActivityIndicator, ProgressBar } from "react-native-paper";

const Home = ({ route }) => {
  const refRBSheet = useRef();
  const [imageUrl, setImageUrl] = useState(null);
  const { user } = route.params;

  const Logout = () => {
    // Logout logic here
    FirebaseAuth.signOut()
      .then(() => {
        console.log("User signed out!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    setImageUrl(user.profilePic);
  };

  const [postImage, setPostImage] = useState(null);
  const handleCamera = async () => {
    const x = await pickCamera();
    setPostImage(x);
  };
  const handleImage = async () => {
    const x = await pickImage();
    setPostImage(x);
  };
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const UploadMedia = async () => {
    const name = `${Math.random().toString(36).substring(1)}`;
    const response = await fetch(postImage.uri);
    const blob = await response.blob();
    const storageRef = ref(FirebaseStorage, `PostMedias/${user._id}/${name}/`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Uploading Image : " + progress + "% done");
    });

    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };
  const MakePost = async () => {
    setLoading(true);
    if (postImage) {
      const image = await UploadMedia();
      const newPost = {
        caption: caption,
        image: image,
        user: user._id,
        createdAt: new Date(),
      };
      const ref = collection(FirestoreDB, "Posts", user._id, "PostsList");
      await addDoc(ref, newPost).then(() => {
        console.log("Post Added!");
        setPostImage(null);
        setCaption("");
        setLoading(false);
        refRBSheet.current.close();
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>SuperApp</Text>
        <View style={styles.iconContainer}>
          <Pressable
            android_ripple={{ color: "grey" }}
            onPress={() => refRBSheet.current.open()}
            style={{
              borderWidth: 1,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="plus" size={20} color="black" />
          </Pressable>
          <Feather name="search" size={20} color="black" />
          <Pressable onPress={Logout}>
            {imageUrl && (
              <Image
                style={{ width: 35, height: 35, borderRadius: 20 }}
                source={{ uri: imageUrl }}
              />
            )}
          </Pressable>
        </View>
      </View>
      <Navigation />

      <RBSheet
        height={555}
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={() => setPostImage(null)}
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
            Add Post
          </Text>
          <View style={{ marginHorizontal: 20 }}>
            {postImage ? (
              <Image
                style={{
                  width: "100%",
                  height: 260,
                  resizeMode: "cover",
                  borderRadius: 20,
                }}
                source={{ uri: postImage.uri }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: "#9897974e",
                  height: 260,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="image" size={50} color="grey" />
                <Text style={{ fontSize: 18, color: "grey" }}>
                  No Image Selected.
                </Text>
              </View>
            )}
          </View>
          <Pressable
            android_ripple={{ color: "grey" }}
            onPress={() => handleImage()}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="image" size={20} color="#186eca" />
            <Text style={{ fontSize: 18, marginLeft: 20 }}>Add Image</Text>
          </Pressable>
          <Pressable
            android_ripple={{ color: "grey" }}
            onPress={() => handleCamera()}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="camera" size={20} color="#e53838" />
            <Text style={{ fontSize: 18, marginLeft: 20 }}>Take Photo</Text>
          </Pressable>
          <TextInput
            placeholder="Enter Caption"
            multiline
            numberOfLines={3}
            onChangeText={(text) => setCaption(text)}
            style={{
              marginVertical: 15,
              marginHorizontal: 20,
              backgroundColor: "#9897974e",
              borderRadius: 30,
              paddingHorizontal: 20,
              fontSize: 15,
              paddingVertical: 0,
            }}
          />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Pressable
              android_ripple={{ color: "grey" }}
              onPress={() => MakePost()}
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.primary,
                borderRadius: 30,
                marginHorizontal: 20,
                paddingHorizontal: 20,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Feather name="send" size={20} color="#ffffff" />
              )}
              <Text
                style={{
                  fontSize: 18,
                  color: Colors.background,
                  marginLeft: 8,
                }}
              >
                Post
              </Text>
            </Pressable>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  headerContainer: {
    backgroundColor: Colors.background,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 4,
    paddingBottom: 12,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    borderColor: "#b8bab89f",
    borderBottomWidth: 0.6,
    borderLeftWidth: 0.6,
    borderRightWidth: 0.6,
  },
  iconContainer: {
    flexDirection: "row",
    width: 110,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
  },
});

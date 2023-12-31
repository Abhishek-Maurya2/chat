import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWXqCux2ZIBhP0SECApWLcKJUouNinQjE",
  authDomain: "chats-994fc.firebaseapp.com",
  projectId: "chats-994fc",
  storageBucket: "chats-994fc.appspot.com",
  messagingSenderId: "9780102224",
  appId: "1:9780102224:web:9bedc602f4e69a34917d55",
};

// Initialize Firebase
const App = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const FirebaseAuth = initializeAuth(App, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const FirestoreDB = getFirestore(App);

const FirebaseStorage = getStorage(App);

export { App, FirebaseAuth, FirestoreDB, FirebaseStorage };

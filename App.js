import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Home from "./Screens/Home";
import SplashScreen from "./Screens/SplashScreen";
import AddChat from "./Screens/Chat/AddChat";
import ChatPage from "./Screens/Chat/ChatPage";
import Profile from "./Screens/Chat/Profile";

import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuthStore from "./store/AuthStore";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const UserState = async () => {
      const user = await AsyncStorage.getItem("LoggedIn-User");
      if (user) {
        useAuthStore.setState({ user: JSON.parse(user) });
      }
    }
    UserState();
  }, []);

  return (
    // <SafeAreaView style={styles.safearea}>
    <PaperProvider>
      <NavigationContainer style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddChat"
            component={AddChat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChatPage"
            component={ChatPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    //</SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  safearea: {
    flex: 1,
  },
});

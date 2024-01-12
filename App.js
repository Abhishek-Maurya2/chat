import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Home from "./Screens/Home";
import SplashScreen from "./Screens/SplashScreen";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import AddChat from "./Screens/Chat/AddChat";
import ChatPage from "./Screens/Chat/ChatPage";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.safearea}>
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
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  safearea: {
    flex: 1,
    backgroundColor: "#0e806a",
  },
});

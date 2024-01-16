import React from "react";
import Chat from "../Screens/Chat/Chat";
import Status from "../Screens/statusComp/Status";
import Community from "../Screens/Community";
import Calls from "../Screens/Calls";
import { MaterialCommunityIcons, Feather } from "react-native-vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "./Colors";
const Tab = createMaterialBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor={Colors.onSecondaryContainer}
      barStyle={{ backgroundColor: Colors.background }}
      activeIndicatorStyle={{ backgroundColor: Colors.secondaryContainer }}
    >
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "message-text" : "message-text-outline"}
              size={24}
              color={color}
            />
          ),
          tabBarLabel: "Chats",
        }}
      />
      <Tab.Screen
        name="Status"
        component={Status}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialCommunityIcons name="slack" size={25} color={color} />
            ) : (
              <Feather name="slack" size={22} color={color} />
            ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Community}
        options={{
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="account-group"
                size={25}
                color={color}
              />
            ) : (
              <MaterialCommunityIcons
                name="account-group-outline"
                size={25}
                color={color}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={Calls}
        options={{
          tabBarIcon: ({ color, focused }) =>
            // <Feather name={focused ? "phone-call" : "phone"} size={20} color={color} />
            focused ? (
              <FontAwesome5 name="phone-alt" size={19} color={color} />
            ) : (
              <Feather name="phone" size={20} color={color} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Navigation;

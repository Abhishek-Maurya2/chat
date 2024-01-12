import React from "react";
import Chat from "../Screens/Chat";
import Status from "../Screens/Status";
import Community from "../Screens/Community";
import Calls from "../Screens/Calls";
import { MaterialCommunityIcons, Feather } from "react-native-vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";

const Tab = createMaterialBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      activeColor="#0e806a"
      barStyle={{ backgroundColor: "white" }}
    >
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "message-text" : "message-text-outline"}
              size={20}
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
              <MaterialCommunityIcons name="slack" size={23} color={color} />
            ) : (
              <Feather name="slack" size={21} color={color} />
            ),
        }}
      />
      <Tab.Screen
        name="Community"
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
              <FontAwesome5 name="phone-alt" size={18} color={color} />
            ) : (
              <Feather name="phone" size={20} color={color} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Navigation;

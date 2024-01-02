import React, { useState } from "react";
import Chat from "../Screens/Chat";
import Status from "../Screens/Status";
import Community from "../Screens/Community";
import Calls from "../Screens/Calls";
import { Feather } from "react-native-vector-icons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";


const Tab = createMaterialBottomTabNavigator();

const Navigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarIndicatorStyle: {
          backgroundColor: "white",
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: "#0e806a",
        },
      }}
    >
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="message-circle" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Status"
        component={Status}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="slack" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="users" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={Calls}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="phone-call" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default Navigation;

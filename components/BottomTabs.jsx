// components/BottomTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import PlayerScreen from "../screens/PlayerScreen";
import TeamsScreen from "../screens/TeamsScreen";
import LeagueScreen from "../screens/LeagueScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="soccer" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Players"
        component={PlayerScreen}
        options={{
          tabBarLabel: "Jogadores",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Teams"
        component={TeamsScreen}
        options={{
          tabBarLabel: "Times",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Championships"
        component={LeagueScreen}
        options={{
          tabBarLabel: "Ligas",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trophy" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

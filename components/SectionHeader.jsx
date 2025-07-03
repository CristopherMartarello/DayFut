import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../context/ThemeContext";

export default function SectionHeader({ title, count }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text
        className={`font-bold mb-2 text-xl ${
          isDark ? "text-gray-200" : "text-zinc-800"
        }`}
      >
        {title} {count != null && <>({count})</>}
      </Text>

      <TouchableOpacity onPress={toggleTheme}>
        <Icon
          name={isDark ? "white-balance-sunny" : "moon-waning-crescent"}
          size={24}
          color={isDark ? "#facc15" : "#2563eb"}
        />
      </TouchableOpacity>
    </View>
  );
}

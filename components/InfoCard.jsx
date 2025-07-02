import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function InfoCard({ imageUri, icon, text }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      className={`items-center p-4 rounded-xl mb-4 w-24 ${
        isDark ? "bg-zinc-700" : "bg-gray-100"
      }`}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="w-12 h-12"
          resizeMode="contain"
        />
      ) : (
        <View>{icon}</View>
      )}
      <Text
        className={`text-center text-xs font-semibold mt-1 ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {text}
      </Text>
    </View>
  );
}

import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../context/ThemeContext";

const icons = {
  Website: "web",
  Facebook: "facebook",
  Instagram: "instagram",
  Twitter: "twitter",
  YouTube: "youtube",
  RSS: "rss",
};

export default function SocialLink({ label, url }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!url) return null;

  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const iconName = icons[label] || "link-variant";

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(fullUrl)}
      className={`flex-row items-center rounded-xl px-4 py-3 mb-2 ${
        isDark ? "bg-zinc-700" : "bg-gray-100"
      }`}
    >
      <Icon name={iconName} size={24} color={isDark ? "#60a5fa" : "#2563eb"} />
      <Text
        className={`ml-3 text-base font-medium ${
          isDark ? "text-blue-400" : "text-blue-700"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

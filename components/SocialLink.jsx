// components/SocialLink.js
import React from "react";
import { View, Text, TouchableOpacity, Linking, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const icons = {
  Website: "web",
  Facebook: "facebook",
  Instagram: "instagram",
  Twitter: "twitter",
  YouTube: "youtube",
  RSS: "rss",
};

export default function SocialLink({ label, url }) {
  if (!url) return null;

  // Garante que a URL começa com http(s)
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const iconName = icons[label] || "link-variant";

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(fullUrl)}
      className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-2"
    >
      <Icon name={iconName} size={24} color="#2563eb" />
      <Text className="ml-3 text-base text-blue-700 font-medium">{label}</Text>
    </TouchableOpacity>
  );
}

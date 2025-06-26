import React from "react";
import { View, Text, Image } from "react-native";

export default function InfoCard({ imageUri, icon, text }) {
  return (
    <View className="items-center bg-gray-100 p-4 rounded-xl mb-4 w-24">
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-12 h-12"
          resizeMode="contain"
        />
      )}
      {icon && <View>{icon}</View>}
      <Text className="text-center text-xs font-semibold mt-1">{text}</Text>
    </View>
  );
}

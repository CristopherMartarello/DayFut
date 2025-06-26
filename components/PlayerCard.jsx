import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function PlayerCard({ player }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 flex-row gap-4 p-2"
      onPress={() => navigation.navigate("Jogador", { player })}
    >
      {/* Imagem */}
      {player.strCutout ? (
        <Image
          source={{ uri: player.strCutout }}
          className="w-24 h-24 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-xs text-gray-500">Sem imagem</Text>
        </View>
      )}

      {/* Info resumida */}
      <View className="flex-1 justify-center">
        <Text className="text-lg font-bold">{player.strPlayer}</Text>
        <Text className="text-sm text-gray-700">{player.strTeam}</Text>
        <Text className="text-sm text-gray-500 italic">
          {player.strPosition}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

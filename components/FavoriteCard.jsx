import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import {
  addUserFavorite,
  removeUserFavorite,
} from "../services/userPlayersService";

export default function FavoriteCard({ player, isFavorite, onFavoriteChange }) {
  const navigation = useNavigation();

  const handleToggleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    if (isFavorite) {
      await removeUserFavorite(userId, player.idPlayer, "player");
    } else {
      await addUserFavorite(userId, player.idPlayer, "player");
    }
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 flex-col gap-4 p-4"
      onPress={() => navigation.navigate("Jogador", { player })}
      activeOpacity={0.8}
    >
      {/* Imagem */}
      {player.strRender ? (
        <Image
          source={{ uri: player.strRender }}
          className="min-w-64 min-h-64 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="min-w-64 min-h-64 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-xs text-gray-500">Sem imagem</Text>
        </View>
      )}

      <View className="flex flex-row justify-center">
        {/* Info resumida */}
        <View className="flex-1 justify-center">
          <Text className="text-lg font-bold">{player.strPlayer}</Text>
          <Text className="text-sm text-gray-700">{player.strTeam}</Text>
          <Text className="text-sm text-gray-500 italic">
            {player.strPosition}
          </Text>
        </View>

        {/* Botão de favoritar */}
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={{ padding: 8, alignSelf: "center" }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={34}
            color={isFavorite ? "#FFD700" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

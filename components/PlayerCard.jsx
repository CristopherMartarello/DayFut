import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import {
  addUserFavorite,
  removeUserFavorite,
} from "../services/userPlayersService";
import api from "../api/api";

export default function PlayerCard({ player, isFavorite, onFavoriteChange }) {
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

  const handlePress = async () => {
    try {
      const response = await api.get(`/lookupplayer.php?id=${player.idPlayer}`);
      const fullPlayer = response.data.players?.[0];
      if (fullPlayer) {
        navigation.navigate("Jogador", { player: fullPlayer });
      } else {
        console.warn("Jogador não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar jogador completo:", err);
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 flex-row gap-4 p-2"
      onPress={handlePress}
      activeOpacity={0.8}
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

      {/* Botão de favoritar */}
      <TouchableOpacity
        onPress={handleToggleFavorite}
        style={{ padding: 8, alignSelf: "center" }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFavorite ? "star" : "star-outline"}
          size={28}
          color={isFavorite ? "#FFD700" : "#888"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

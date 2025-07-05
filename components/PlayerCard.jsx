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
import { useTheme } from "../context/ThemeContext";
import { useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favoriteSlice";

export default function PlayerCard({ player, isFavorite, onFavoriteChange }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const isDark = theme === "dark";

  const handleToggleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    if (isFavorite) {
      await removeUserFavorite(userId, player.idPlayer, "player");
      dispatch(removeFavorite({ category: "players", item: player.idPlayer }));
    } else {
      await addUserFavorite(userId, player.idPlayer, "player");
      dispatch(addFavorite({ category: "players", item: player.idPlayer }));
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

  const bgCard = isDark ? "bg-zinc-800" : "bg-white";
  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const textTertiary = isDark ? "text-gray-400" : "text-gray-500";
  const bgImageFallback = isDark ? "bg-zinc-700" : "bg-gray-200";

  return (
    <TouchableOpacity
      className={`${bgCard} rounded-2xl mb-4 mt-2 flex-row gap-4 p-2`}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Imagem */}
      {player.strCutout ? (
        <Image
          source={{ uri: player.strCutout }}
          className="w-24 h-24 rounded-lg"
          style={{ backgroundColor: isDark ? "#3f3f46" : "#e5e7eb" }}
          resizeMode="cover"
        />
      ) : (
        <View
          className={`w-24 h-24 ${bgImageFallback} rounded-lg items-center justify-center`}
        >
          <Text className={`text-xs ${textTertiary}`}>Sem imagem</Text>
        </View>
      )}

      {/* Info resumida */}
      <View className="flex-1 justify-center">
        <Text className={`text-lg font-bold ${textPrimary}`}>
          {player.strPlayer}
        </Text>
        <Text className={`text-sm ${textSecondary}`}>{player.strTeam}</Text>
        <Text className={`text-sm italic ${textTertiary}`}>
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
          color={isFavorite ? "#FFD700" : isDark ? "#ccc" : "#888"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

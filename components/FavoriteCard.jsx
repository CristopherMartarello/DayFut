import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import {
  addUserFavorite,
  removeUserFavorite,
} from "../services/userPlayersService";
import { useTheme } from "../context/ThemeContext";

export default function FavoriteCard({ player, isFavorite, onFavoriteChange }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  const bgCard = isDark ? "bg-zinc-800" : "bg-white";
  const textPrimary = isDark ? "text-white" : "text-zinc-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const textTertiary = isDark ? "text-gray-400" : "text-gray-500";
  const bgImageFallback = isDark ? "bg-zinc-700" : "bg-gray-200";

  return (
    <TouchableOpacity
      className={`${bgCard} rounded-2xl mb-4 flex-col gap-4 p-4`}
      onPress={() => navigation.navigate("Jogador", { player })}
      activeOpacity={0.8}
    >
      {/* Imagem */}
      {player.strRender ? (
        <Image
          source={{ uri: player.strRender }}
          className={`min-w-64 min-h-64 rounded-lg ${
            isDark ? "bg-zinc-900" : "bg-gray-200"
          }`}
          resizeMode="cover"
        />
      ) : (
        <View
          className={`min-w-64 min-h-64 ${bgImageFallback} rounded-lg items-center justify-center`}
        >
          <Text className={`${textTertiary} text-xs`}>Sem imagem</Text>
        </View>
      )}

      <View className="flex flex-row justify-center">
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
            size={34}
            color={isFavorite ? "#FFD700" : isDark ? "#ccc" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

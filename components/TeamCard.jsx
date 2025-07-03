import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { addUserTeam, removeUserTeam } from "../services/userTeamsService";
import api from "../api/api";
import { useTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

export default function TeamCard({ team, isFavorite, onFavoriteChange }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { dispatch } = useFavorites();
  const isDark = theme === "dark";

  const handleToggleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      if (isFavorite) {
        await removeUserTeam(userId, team.idTeam);
        dispatch({
          type: "REMOVE_FAVORITE",
          payload: { category: "teams", item: team.idTeam },
        });
      } else {
        await addUserTeam(userId, team.idTeam, team.strTeam);
        dispatch({
          type: "ADD_FAVORITE",
          payload: { category: "teams", item: team.idTeam },
        });
      }

      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error("Erro ao alternar favorito de time:", error);
    }
  };

  const handlePress = async () => {
    try {
      const response = await api.get(`/searchteams.php?t=${team.strTeam}`);
      const fullTeam = response.data.teams?.[0];
      if (fullTeam) {
        navigation.navigate("Time", { team: fullTeam });
      } else {
        console.warn("Time não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar time completo:", err);
    }
  };

  return (
    <TouchableOpacity
      className={`${
        isDark ? "bg-zinc-800" : "bg-white"
      } rounded-2xl mb-4 mt-2 flex-row gap-4 p-2`}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Imagem do escudo */}
      {team.strBadge ? (
        <Image
          source={{ uri: team.strBadge }}
          className="w-24 h-24 rounded-lg p-2"
          style={{ backgroundColor: isDark ? "#3f3f46" : "#e5e7eb" }}
          resizeMode="contain"
        />
      ) : (
        <View className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-xs text-gray-500">Sem imagem</Text>
        </View>
      )}

      {/* Info resumida */}
      <View className="flex-1 justify-center">
        <Text
          className="text-lg font-bold"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        >
          {team.strTeam}
        </Text>
        <Text
          className="text-sm"
          style={{ color: isDark ? "#d1d5db" : "#374151" }}
        >
          {team.strCountry}
        </Text>
        <Text
          className="text-sm italic"
          style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
        >
          {team.strStadium}
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

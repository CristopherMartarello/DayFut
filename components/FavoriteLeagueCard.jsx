import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import {
  addUserLeague,
  removeUserLeague,
} from "../services/userLeaguesService";
import { useTheme } from "../context/ThemeContext";

export default function FavoriteLeagueCard({
  league,
  isFavorite,
  onFavoriteChange,
}) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleToggleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    if (isFavorite) {
      await removeUserLeague(userId, league.idLeague);
    } else {
      await addUserLeague(userId, league.idLeague);
    }
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  return (
    <TouchableOpacity
      className={`rounded-2xl mb-4 p-4 flex-col justify-between items-center ${
        isDark ? "bg-zinc-800" : "bg-white"
      }`}
      onPress={() => navigation.navigate("Liga", { leagueId: league.idLeague })}
      activeOpacity={0.8}
    >
      {league.strBadge ? (
        <Image
          source={{ uri: league.strBadge }}
          className={`min-w-48 min-h-48 rounded-lg p-2 ${
            isDark ? "bg-zinc-900" : "bg-gray-200"
          }`}
          resizeMode="cover"
        />
      ) : (
        <View className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-xs text-gray-500">Sem imagem</Text>
        </View>
      )}

      <View className="flex-row justify-between items-center mt-4">
        <View className="flex-1 pr-2">
          <Text
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {league.strLeague}
          </Text>
          <Text
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {league.strCountry}
          </Text>
          <Text
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {league.strCurrentSeason}
          </Text>
        </View>

        <TouchableOpacity onPress={handleToggleFavorite}>
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={28}
            color={isFavorite ? "#FFD700" : isDark ? "#aaa" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

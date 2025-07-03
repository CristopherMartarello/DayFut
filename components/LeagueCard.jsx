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
import { useFavorites } from "../context/FavoritesContext";

export default function LeagueCard({ league, isFavorite, onFavoriteChange }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { dispatch } = useFavorites();
  const isDark = theme === "dark";

  const handleToggleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    if (isFavorite) {
      await removeUserLeague(userId, league.idLeague);
      dispatch({
        type: "REMOVE_FAVORITE",
        payload: { category: "leagues", item: league.idLeague },
      });
    } else {
      await addUserLeague(userId, league.idLeague);
      dispatch({
        type: "ADD_FAVORITE",
        payload: { category: "leagues", item: league.idLeague },
      });
    }
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  return (
    <TouchableOpacity
      className={`rounded-2xl mb-4 mt-2 flex-row gap-4 p-2 ${
        isDark ? "bg-zinc-800" : "bg-white"
      }`}
      onPress={() => navigation.navigate("Liga", { leagueId: league.idLeague })}
      activeOpacity={0.8}
    >
      {league.strBadge ? (
        <Image
          source={{ uri: league.strBadge }}
          className="w-24 h-24 rounded-lg p-2"
          style={{ backgroundColor: isDark ? "#3f3f46" : "#e5e7eb" }}
          resizeMode="cover"
        />
      ) : (
        <View className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-xs text-gray-500">Sem imagem</Text>
        </View>
      )}

      <View className="flex-1 justify-center">
        <Text
          className={`text-lg font-bold ${
            isDark ? "text-white" : "text-black"
          }`}
          numberOfLines={1}
          ellipsizeMode="tail"
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

      <TouchableOpacity
        onPress={handleToggleFavorite}
        style={{ padding: 8, alignSelf: "center" }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFavorite ? "star" : "star-outline"}
          size={28}
          color={isFavorite ? "#FFD700" : isDark ? "#aaa" : "#888"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

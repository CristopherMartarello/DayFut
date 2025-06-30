import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebaseConfig";
import {
  addUserLeague,
  removeUserLeague,
} from "../services/userLeaguesService";

export default function LeagueCard({ league, isFavorite, onFavoriteChange }) {
  const navigation = useNavigation();

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
      className="bg-white rounded-2xl mb-4 p-4 flex-row justify-between items-center"
      onPress={() => navigation.navigate("LeagueDetails", { league })}
      activeOpacity={0.8}
    >
      <View>
        <Text className="text-lg font-bold">{league.strLeague}</Text>
        <Text className="text-sm text-gray-600">{league.strCountry}</Text>
      </View>

      <TouchableOpacity onPress={handleToggleFavorite}>
        <Ionicons
          name={isFavorite ? "star" : "star-outline"}
          size={28}
          color={isFavorite ? "#FFD700" : "#888"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

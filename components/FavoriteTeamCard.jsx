import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import {
  addUserFavorite,
  removeUserFavorite,
} from "../services/userPlayersService";

export default function FavoriteTeamCard({
  team,
  isFavorite,
  onFavoriteChange,
}) {
  const navigation = useNavigation();

  const handleToggleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    if (isFavorite) {
      await removeUserFavorite(userId, team.idTeam, "team");
    } else {
      await addUserFavorite(userId, team.idTeam, "team");
    }
    if (onFavoriteChange) {
      onFavoriteChange();
    }
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 flex-col gap-4 p-4"
      onPress={() => navigation.navigate("Time", { team })}
      activeOpacity={0.8}
    >
      {/* Imagem do escudo */}
      {team.strBadge ? (
        <Image
          source={{ uri: team.strBadge }}
          className="min-w-40 min-h-40 rounded-lg bg-gray-200 p-2"
          resizeMode="contain"
        />
      ) : (
        <View className="min-w-64 min-h-64 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-xs text-gray-500">Sem imagem</Text>
        </View>
      )}

      <View className="flex flex-row justify-center">
        {/* Info resumida */}
        <View className="flex-1 justify-center">
          <Text className="text-lg font-bold">{team.strTeam}</Text>
          <Text className="text-sm text-gray-700">{team.strCountry}</Text>
          <Text className="text-sm text-gray-500 italic">
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
            size={34}
            color={isFavorite ? "#FFD700" : "#888"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

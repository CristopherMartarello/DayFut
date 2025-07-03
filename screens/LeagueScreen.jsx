import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { Searchbar } from "react-native-paper";
import api from "../api/api";
import { auth } from "../firebaseConfig";
import LeagueCard from "../components/LeagueCard";
import {
  getUserLeagues,
  addUserLeague,
  removeUserLeague,
} from "../services/userLeaguesService";
import FavoriteLeagueCard from "../components/FavoriteLeagueCard";
import SectionHeader from "../components/SectionHeader";
import { useTheme } from "../context/ThemeContext";

export default function LeagueScreen() {
  const [leagues, setLeagues] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteLeagues, setFavoriteLeagues] = useState([]);
  const [refreshFavorites, setRefreshFavorites] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await api.get("/all_leagues.php");
        const soccerLeagues = res.data.leagues.filter(
          (l) => l.strSport === "Soccer"
        );

        const detailedLeagues = await Promise.all(
          soccerLeagues.map(async (league) => {
            const detailRes = await api.get(
              `/lookupleague.php?id=${league.idLeague}`
            );
            return detailRes.data.leagues?.[0];
          })
        );

        const valid = detailedLeagues.filter(Boolean);
        setLeagues(valid);
      } catch (err) {
        console.error("Erro ao buscar campeonatos:", err);
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const favs = await getUserLeagues(userId);
      setFavoriteLeagues(favs);
    };
    fetchFavorites();
  }, [refreshFavorites]);

  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (trimmed.length === 0) {
      setFilteredLeagues(leagues);
    } else {
      const filtered = leagues.filter((l) =>
        l.strLeague.toLowerCase().includes(trimmed)
      );
      setFilteredLeagues(filtered);
    }
  }, [searchQuery, leagues]);

  const handleFavoriteChange = () => {
    setRefreshFavorites((prev) => !prev);
  };

  const favoritesData = leagues.filter((l) =>
    favoriteLeagues.includes(l.idLeague)
  );

  return (
    <SafeAreaView
      className={`flex-1 pt-3 ${isDark ? "bg-zinc-900" : "bg-[#FAFAFA]"}`}
    >
      <FlatList
        className="p-4"
        data={filteredLeagues}
        keyExtractor={(item) => item.idLeague}
        renderItem={({ item }) => (
          <LeagueCard
            league={item}
            isFavorite={favoriteLeagues.includes(item.idLeague)}
            onFavoriteChange={handleFavoriteChange}
          />
        )}
        ListHeaderComponent={
          <View>
            {/* Favoritos */}
            <View className="px-3">
              <SectionHeader title="Ligas Favoritas" />
              {favoritesData.length === 0 ? (
                <Text
                  className={`mb-2 text-base ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Nenhuma liga favoritada.
                </Text>
              ) : (
                <FlatList
                  data={favoritesData}
                  keyExtractor={(item) => item.idLeague}
                  horizontal
                  renderItem={({ item }) => (
                    <FavoriteLeagueCard
                      league={item}
                      isFavorite
                      onFavoriteChange={handleFavoriteChange}
                    />
                  )}
                  contentContainerStyle={{ gap: 16 }}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>

            {/* Barra de busca */}
            <View className="p-3">
              <Text
                className={`font-bold mb-2 text-xl ${
                  isDark ? "text-gray-200" : "text-zinc-800"
                }`}
              >
                Buscar Ligas
              </Text>
              <Searchbar
                placeholder="Buscar por nome"
                value={searchQuery}
                onChangeText={setSearchQuery}
                inputStyle={{ color: isDark ? "#fff" : undefined }}
                style={{ backgroundColor: isDark ? "#27272a" : "#fff" }}
                iconColor={isDark ? "#fff" : undefined}
                placeholderTextColor={isDark ? "#9ca3af" : undefined}
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

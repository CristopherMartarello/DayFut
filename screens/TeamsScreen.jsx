import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { Menu, Searchbar, TextInput } from "react-native-paper";
import { auth } from "../firebaseConfig";
import api from "../api/api";
import { getUserTeams } from "../services/userTeamsService";
import TeamCard from "../components/TeamCard";
import FavoriteTeamCard from "../components/FavoriteTeamCard";
import { useTheme } from "../context/ThemeContext";
import SectionHeader from "../components/SectionHeader";

export default function TeamScreen() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("Spanish La Liga");
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);

  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [favoriteTeamsData, setFavoriteTeamsData] = useState([]);
  const [refreshFavorites, setRefreshFavorites] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    api
      .get("/all_leagues.php")
      .then((res) => {
        const validLeagues = res.data.leagues.filter(
          (l) => l.strSport === "Soccer"
        );
        setLeagues(validLeagues);
      })
      .catch((err) => console.error("Erro ao buscar ligas:", err));
  }, []);

  useEffect(() => {
    if (selectedLeague && searchQuery.trim() === "") {
      api
        .get(`/search_all_teams.php?l=${encodeURIComponent(selectedLeague)}`)
        .then((res) =>
          setTeams(Array.isArray(res.data.teams) ? res.data.teams : [])
        )
        .catch((err) => console.error("Erro ao buscar times:", err));
    }
  }, [selectedLeague]);

  useEffect(() => {
    const delay = setTimeout(() => {
      const trimmed = searchQuery.trim();
      if (trimmed.length > 2) {
        setIsSearching(true);
        api
          .get(`/searchteams.php?t=${encodeURIComponent(trimmed)}`)
          .then((res) =>
            setTeams(Array.isArray(res.data.teams) ? res.data.teams : [])
          )
          .catch((err) => {
            console.error("Erro ao buscar times:", err);
            setTeams([]);
          })
          .finally(() => setIsSearching(false));
      } else if (trimmed === "") {
        api
          .get(`/search_all_teams.php?l=${encodeURIComponent(selectedLeague)}`)
          .then((res) =>
            setTeams(Array.isArray(res.data.teams) ? res.data.teams : [])
          )
          .catch((err) => console.error("Erro ao buscar times:", err));
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const favTeams = await getUserTeams(userId);
      setFavoriteTeams(favTeams.map((fav) => fav.teamId));

      if (favTeams.length > 0) {
        const promises = favTeams.map(({ teamName }) =>
          api
            .get(`/searchteams.php?t=${teamName}`)
            .then((res) => res.data.teams?.[0])
        );
        const data = (await Promise.all(promises)).filter(Boolean);
        setFavoriteTeamsData(data);
      } else {
        setFavoriteTeamsData([]);
      }
    };
    fetchFavorites();
  }, [refreshFavorites]);

  const handleFavoriteChange = () => {
    setRefreshFavorites((prev) => !prev);
  };

  const validTeams = Array.isArray(teams)
    ? teams.filter(
        (t, index, self) =>
          t?.idTeam && index === self.findIndex((x) => x.idTeam === t.idTeam)
      )
    : [];

  return (
    <SafeAreaView
      className={`flex-1 pt-3 ${isDark ? "bg-zinc-900" : "bg-[#FAFAFA]"}`}
    >
      <FlatList
        className="p-4"
        data={validTeams}
        keyExtractor={(item) => String(item.idTeam)}
        renderItem={({ item }) => (
          <TeamCard
            team={item}
            isFavorite={favoriteTeams.includes(item.idTeam)}
            onFavoriteChange={handleFavoriteChange}
          />
        )}
        ListHeaderComponent={
          <View>
            <View className="px-3">
              <SectionHeader title={"Times Favoritos"} />
              {favoriteTeamsData.length === 0 ? (
                <Text style={{ color: isDark ? "#ccc" : "#000" }}>
                  Nenhum time favoritado.
                </Text>
              ) : (
                <FlatList
                  data={favoriteTeamsData}
                  keyExtractor={(item) => item.idTeam}
                  horizontal
                  renderItem={({ item }) => (
                    <FavoriteTeamCard
                      team={item}
                      isFavorite={favoriteTeams.includes(item.idTeam)}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  )}
                  contentContainerStyle={{ gap: 16 }}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>

            <View className="p-3">
              <Text
                className="font-bold mb-2 text-xl"
                style={{ color: isDark ? "#fff" : "#000" }}
              >
                Buscar Times
              </Text>
              <View className="gap-4">
                <Searchbar
                  placeholder="Pesquisar por nome"
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  inputStyle={{ color: isDark ? "#fff" : undefined }}
                  style={{ backgroundColor: isDark ? "#27272a" : "#fff" }}
                  iconColor={isDark ? "#fff" : undefined}
                  placeholderTextColor={isDark ? "#9ca3af" : undefined}
                />
                <Menu
                  visible={menuVisible === "league"}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <TouchableOpacity onPress={() => setMenuVisible("league")}>
                      <TextInput
                        label="Liga"
                        mode="outlined"
                        editable={false}
                        pointerEvents="none"
                        value={selectedLeague || "Selecione uma liga"}
                        right={<TextInput.Icon icon="menu-down" />}
                        style={{
                          backgroundColor: isDark ? "#27272a" : "#fff",
                          color: "#fff",
                        }}
                        textColor={isDark ? "#fff" : "#000"}
                      />
                    </TouchableOpacity>
                  }
                >
                  {leagues.map((league) => (
                    <Menu.Item
                      key={league.idLeague}
                      title={league.strLeague}
                      onPress={() => {
                        setSelectedLeague(league.strLeague);
                        setSearchQuery("");
                        setMenuVisible(null);
                      }}
                    />
                  ))}
                </Menu>
              </View>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

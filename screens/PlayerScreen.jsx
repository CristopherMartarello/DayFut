import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Menu, TextInput, Searchbar } from "react-native-paper";
import api from "../api/api";
import PlayerCard from "../components/PlayerCard";
import { getUserPlayers } from "../services/userPlayersService";
import { auth } from "../firebaseConfig";
import FavoriteCard from "../components/FavoriteCard";
import { useTheme } from "../context/ThemeContext";
import SectionHeader from "../components/SectionHeader";
import { useSelector, useDispatch } from "react-redux";
import { setFavorites } from "../redux/favoriteSlice";

export default function PlayerScreen() {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const favoritePlayersCount = useSelector(
    (state) => state.favorites.players.length
  );
  const isDark = theme === "dark";

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("Spanish La Liga");
  const [players, setPlayers] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [favoritePlayersData, setFavoritePlayersData] = useState([]);
  const [refreshFavorites, setRefreshFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery.length > 2) {
        setIsSearching(true);
        api
          .get(`/searchplayers.php?p=${encodeURIComponent(trimmedQuery)}`)
          .then((res) => {
            setPlayers(Array.isArray(res.data.player) ? res.data.player : []);
          })
          .catch((err) => {
            console.error("Erro ao buscar jogador:", err);
            setPlayers([]);
          })
          .finally(() => setIsSearching(false));
      } else if (trimmedQuery === "") {
        api
          .get(`/lookup_all_players.php?id=${selectedTeam}`)
          .then((res) =>
            setPlayers(Array.isArray(res.data.player) ? res.data.player : [])
          )
          .catch((err) => console.error("Erro ao restaurar jogadores:", err));
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedTeam]);

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
    if (selectedLeague) {
      api
        .get(`/search_all_teams.php?l=${encodeURIComponent(selectedLeague)}`)
        .then((res) => {
          setTeams(res.data.teams);
          setSelectedTeam(res.data.teams[0]?.idTeam);
        })
        .catch((err) => console.error("Erro ao buscar times:", err));
    }
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedTeam) {
      setSearchQuery("");
      api
        .get(`/lookup_all_players.php?id=${selectedTeam}`)
        .then((res) =>
          setPlayers(Array.isArray(res.data.player) ? res.data.player : [])
        )
        .catch((err) => console.error("Erro ao buscar jogadores:", err));
    }
  }, [selectedTeam]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const favIds = await getUserPlayers(userId, "player");
      setFavoritePlayers(favIds);

      if (favIds.length > 0) {
        const promises = favIds.map((id) =>
          api
            .get(`/lookupplayer.php?id=${id}`)
            .then((res) => res.data.players?.[0])
        );
        const favPlayersData = (await Promise.all(promises)).filter(Boolean);
        setFavoritePlayersData(favPlayersData);
      } else {
        setFavoritePlayersData([]);
      }
    };
    fetchFavorites();
  }, [refreshFavorites]);

  useEffect(() => {
    if (favoritePlayers.length > 0) {
      dispatch(
        setFavorites({
          category: "players",
          items: favoritePlayers,
        })
      );
    } else {
      dispatch(
        setFavorites({
          category: "players",
          items: [],
        })
      );
    }
  }, [favoritePlayers]);

  const handleFavoriteChange = () => {
    setRefreshFavorites((prev) => !prev);
  };

  const validPlayers = players.filter(
    (p, index, self) =>
      p?.idPlayer && index === self.findIndex((t) => t.idPlayer === p.idPlayer)
  );

  return (
    <SafeAreaView
      className={`flex-1 pt-3 ${isDark ? "bg-zinc-900" : "bg-[#FAFAFA]"}`}
    >
      <FlatList
        className="p-4"
        data={validPlayers}
        keyExtractor={(item) => String(item.idPlayer)}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            isFavorite={favoritePlayers.includes(item.idPlayer)}
            onFavoriteChange={handleFavoriteChange}
          />
        )}
        ListHeaderComponent={
          <View>
            <View className="px-3">
              <SectionHeader
                title={"Jogadores Favoritos"}
                count={favoritePlayersCount}
              />
              {favoritePlayersData.length === 0 ? (
                <Text className={isDark ? "text-gray-400" : "text-gray-700"}>
                  Nenhum jogador favoritado.
                </Text>
              ) : (
                <FlatList
                  contentContainerStyle={{ gap: 16 }}
                  data={favoritePlayersData}
                  keyExtractor={(item) => item.idPlayer}
                  renderItem={({ item }) => (
                    <FavoriteCard
                      player={item}
                      isFavorite={favoritePlayers.includes(item.idPlayer)}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  )}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>

            <View className="p-3">
              <Text
                className={`font-bold mb-2 text-xl ${
                  isDark ? "text-gray-200" : "text-zinc-800"
                }`}
              >
                Buscar Jogadores
              </Text>
              <View className="gap-4">
                <Searchbar
                  mode="bar"
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
                        setSelectedTeam("");
                        setMenuVisible(false);
                      }}
                    />
                  ))}
                </Menu>
                <Menu
                  visible={menuVisible === "team"}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={
                    <TouchableOpacity onPress={() => setMenuVisible("team")}>
                      <TextInput
                        label="Time"
                        mode="outlined"
                        editable={false}
                        pointerEvents="none"
                        value={
                          teams.find((t) => t.idTeam === selectedTeam)
                            ?.strTeam || "Selecione um time"
                        }
                        right={<TextInput.Icon icon="menu-down" />}
                        style={{
                          backgroundColor: isDark ? "#27272a" : "#fff",
                          color: "#fff",
                        }}
                        textColor={isDark ? "#fff" : "#000"}
                        placeholderTextColor={isDark ? "#fff" : undefined}
                      />
                    </TouchableOpacity>
                  }
                >
                  {teams.map((team) => (
                    <Menu.Item
                      key={team.idTeam}
                      title={team.strTeam}
                      onPress={() => {
                        setSelectedTeam(team.idTeam);
                        setMenuVisible(false);
                      }}
                    />
                  ))}
                </Menu>
              </View>
            </View>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

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

export default function PlayerScreen() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("133739");
  const [players, setPlayers] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [favoritePlayersData, setFavoritePlayersData] = useState([]);
  const [refreshFavorites, setRefreshFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Search teams
  useEffect(() => {
    api
      .get("/search_all_teams.php?l=Spanish La Liga")
      .then((res) => setTeams(res.data.teams))
      .catch((err) => console.error("Erro ao buscar times:", err));
  }, []);

  // Search players by selected team
  useEffect(() => {
    if (selectedTeam) {
      api
        .get(`/lookup_all_players.php?id=${selectedTeam}`)
        .then((res) => setPlayers(res.data.player || []))
        .catch((err) => console.error("Erro ao buscar jogadores:", err));
    }
  }, [selectedTeam]);

  // Search favorite players
  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      const favIds = await getUserPlayers(userId, "player");
      setFavoritePlayers(favIds);

      // search player data for favorite players
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

  const handleFavoriteChange = () => {
    setRefreshFavorites((prev) => !prev);
  };

  return (
    <SafeAreaView className="flex-1 pt-3 bg-[#FAFAFA]">
      <FlatList
        className="p-4"
        data={players}
        keyExtractor={(item) => item.idPlayer}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            isFavorite={favoritePlayers.includes(item.idPlayer)}
            onFavoriteChange={handleFavoriteChange}
          />
        )}
        ListHeaderComponent={
          <View>
            {/* Seção: Jogadores Favoritos */}
            <View className="px-3">
              <Text className="font-bold mb-2 text-xl">
                Meus Jogadores Favoritos
              </Text>
              {favoritePlayersData.length === 0 ? (
                <Text>Nenhum jogador favoritado.</Text>
              ) : (
                <FlatList
                  contentContainerStyle={{
                    gap: 16,
                  }}
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

            {/* Seção: Pesquisa e filtro por time */}
            <View className="p-3">
              <Text className="font-bold mb-2 text-xl">
                Descobrir Jogadores
              </Text>
              <View className="gap-4">
                <Searchbar
                  placeholder="Pesquisar"
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                />
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
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

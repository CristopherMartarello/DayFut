import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import api from "../api/api";
import PlayerCard from "../components/PlayerCard";
import { getUserPlayers } from "../services/userPlayersService";
import { auth } from "../firebaseConfig";

export default function PlayerScreen() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("133739");
  const [players, setPlayers] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [favoritePlayersData, setFavoritePlayersData] = useState([]);

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
  }, []);

  return (
    <>
      <View className="p-8">
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
                  teams.find((t) => t.idTeam === selectedTeam)?.strTeam ||
                  "Selecione um time"
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

      {/* Favorite Players Section */}
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>
          Meus Jogadores Favoritos
        </Text>
        {favoritePlayersData.length === 0 ? (
          <Text>Nenhum jogador favoritado.</Text>
        ) : (
          <FlatList
            data={favoritePlayersData}
            keyExtractor={(item) => item.idPlayer}
            renderItem={({ item }) => <PlayerCard player={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      <FlatList
        className="px-2"
        data={players}
        keyExtractor={(item) => item.idPlayer}
        renderItem={({ item }) => <PlayerCard player={item} />}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
}

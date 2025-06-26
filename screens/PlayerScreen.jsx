import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import api from "../api/api";
import PlayerCard from "../components/PlayerCard";

export default function PlayerScreen() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("133739");
  const [players, setPlayers] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    api
      .get("/search_all_teams.php?l=Spanish La Liga")
      .then((res) => setTeams(res.data.teams))
      .catch((err) => console.error("Erro ao buscar times:", err));
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      api
        .get(`/lookup_all_players.php?id=${selectedTeam}`)
        .then((res) => setPlayers(res.data.player || []))
        .catch((err) => console.error("Erro ao buscar jogadores:", err));
    }
  }, [selectedTeam]);

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

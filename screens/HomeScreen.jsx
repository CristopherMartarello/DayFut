import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ActivityIndicator, Button, Menu, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import api from "../api/api";
import EventCard from "../components/EventCard";
import { useTheme } from "../context/ThemeContext";

export default function HomeScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const [selectedLeague, setSelectedLeague] = useState({
    strLeague: "English Premier League",
    idLeague: "4328",
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(
          `/eventsseason.php?id=${selectedLeague.idLeague}&s=2025-2026`
        );
        const upcoming = res.data.events?.filter(
          (ev) => ev.strStatus === "Not Started"
        );
        setEvents(upcoming);
      } catch (err) {
        console.error("Erro ao buscar jogos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedLeague) fetchEvents();
  }, [selectedLeague]);

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

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-zinc-900" : "bg-[#FAFAFA]"}`}
    >
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 48 }}
        />
      ) : (
        <FlatList
          className="p-4"
          data={events}
          keyExtractor={(item) => item.idEvent}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => <EventCard item={item} />}
          ListHeaderComponent={
            <View className="p-2">
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-zinc-800"
                  }`}
                >
                  Próximos Jogos
                </Text>

                <TouchableOpacity onPress={toggleTheme}>
                  <Icon
                    name={
                      isDark ? "white-balance-sunny" : "moon-waning-crescent"
                    }
                    size={24}
                    color={isDark ? "#facc15" : "#2563eb"}
                  />
                </TouchableOpacity>
              </View>

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <TextInput
                      label="Liga"
                      mode="outlined"
                      editable={false}
                      pointerEvents="none"
                      value={selectedLeague.strLeague || "Selecione uma liga"}
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
                      setSelectedLeague(league);
                      setMenuVisible(false);
                    }}
                  />
                ))}
              </Menu>

              {!events && (
                <View
                  className={`rounded-2xl p-6 items-center justify-center shadow-md mt-8 mx-1 ${
                    isDark ? "bg-zinc-800" : "bg-white"
                  }`}
                >
                  <Icon name="calendar-remove" size={48} color="#9ca3af" />
                  <Text
                    className={`text-lg font-semibold mt-4 text-center ${
                      isDark ? "text-white" : "text-zinc-700"
                    }`}
                  >
                    Sem jogos disponíveis
                  </Text>
                  <Text
                    className={`text-base text-center mt-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Nenhum resultado encontrado para esta liga.
                  </Text>
                </View>
              )}
            </View>
          }
          ListFooterComponent={
            <View className="px-4 mt-8">
              <Button
                mode="contained"
                buttonColor="#3b82f6"
                textColor="white"
                onPress={() => signOut(auth)}
              >
                Sair
              </Button>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

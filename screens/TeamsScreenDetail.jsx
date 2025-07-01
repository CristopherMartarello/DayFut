// TeamDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import InfoCard from "../components/InfoCard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from "../api/api";

export default function TeamDetailsScreen({ route }) {
  const { team } = route.params;
  const [venue, setVenue] = useState(null);
  const [flag, setFlag] = useState(null);
  const [normalizedString, setNormalizedString] = useState("");
  const [leaguesData, setLeaguesData] = useState([]);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await api.get(`/lookupvenue.php?id=${team.idVenue}`);
        setVenue(res.data.venues?.[0]);
      } catch (err) {
        console.error("Erro ao buscar estádio:", err);
      }
    };

    fetchVenue();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const correctedName = normalizeNationality(team.strLocation);
        setNormalizedString(correctedName);

        const countryRes = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            correctedName
          )}?fullText=true`
        );
        const countryData = await countryRes.json();
        const flagUrl = countryData?.[0]?.flags?.png;
        if (flagUrl) {
          setFlag(flagUrl);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do time ou país:", error);
      }
    };

    fetchData();
  }, []);

  const normalizeNationality = (nationality) => {
    const exceptions = {
      England: "United Kingdom",
      Scotland: "United Kingdom",
      Wales: "United Kingdom",
      "Northern Ireland": "United Kingdom",
      USA: "United States",
      "Ivory Coast": "Côte d'Ivoire",
      "South Korea": "Korea (Republic of)",
      "North Korea": "Korea (Democratic People's Republic of)",
      Russia: "Russian Federation",
    };

    const cleanName = nationality.split(",")[1]?.trim() ?? nationality;
    return exceptions[cleanName] || cleanName;
  };

  const leaguesList = [];
  for (let i = 1; i <= 7; i++) {
    const name = team[i === 1 ? "strLeague" : `strLeague${i}`];
    const id = team[i === 1 ? "idLeague" : `idLeague${i}`];
    if (name && id) leaguesList.push({ name, id });
  }

  useEffect(() => {
    const fetchLeagues = async () => {
      const promises = leaguesList.map(({ id }) =>
        api
          .get(`/lookupleague.php?id=${id}`)
          .then((res) => res.data.leagues?.[0])
      );
      const results = (await Promise.all(promises)).filter(Boolean);
      setLeaguesData(results);
    };
    if (leaguesList.length) fetchLeagues();
  }, [team]);

  return (
    <ScrollView className="bg-gray-100" showsVerticalScrollIndicator={false}>
      {team.strFanart1 && (
        <Image
          source={{ uri: team.strFanart1 || team.strFanart1 }}
          className="w-full h-96"
          resizeMode="cover"
        />
      )}

      <View className="mt-[-18px] bg-white p-6 rounded-3xl shadow-lg z-10">
        <Text className="text-3xl font-bold mb-2">{team.strTeam}</Text>

        <Text className="mb-4 text-base text-gray-500">
          {team.strDescriptionEN ||
            team.strStadiumDescription ||
            "Sem descrição."}
        </Text>

        <Text className="text-xl font-bold mb-2">Informações Gerais</Text>

        <View className="flex-row justify-center gap-3">
          <View className="items-center bg-gray-100 p-4 rounded-xl mb-4 w-24">
            <Image
              source={{ uri: team.strEquipment }}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
          <InfoCard
            imageUri={flag}
            icon={<Icon name="flag" size={40} color="#2563eb" />}
            text={normalizedString}
          />
          <InfoCard
            icon={<Icon name="soccer-field" size={40} color="#2563eb" />}
            text={team.strStadium}
          />
          <InfoCard imageUri={team.strBadge} text={team.strTeam} />
        </View>

        <Text className="text-base text-gray-500 mb-1">
          <Text className="font-semibold">Fundado em:</Text>{" "}
          {team.intFormedYear}
        </Text>
        <Text className="text-base text-gray-500 mb-1">
          <Text className="font-semibold">Estádio:</Text> {team.strStadium} (
          {team.intStadiumCapacity} lugares)
        </Text>
        <Text className="text-base text-gray-500 mb-1">
          <Text className="font-semibold">Localização:</Text> {team.strLocation}
        </Text>

        <View className="flex-row flex-wrap mb-1">
          <Text className="text-base font-semibold text-gray-500">
            Site Oficial:{" "}
          </Text>
          {team.strWebsite && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`https://${team.strWebsite}`)}
            >
              <Text className="text-base text-blue-600 underline">
                {team.strWebsite}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {leaguesData.length > 0 && (
          <View className="my-4">
            <Text className="text-xl font-bold mb-2">Principais Ligas</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {leaguesData.map((lg) => (
                <View className="flex-col">
                  <View
                    key={lg.idLeague}
                    className="items-center p-6 bg-gray-100 rounded-xl"
                  >
                    {lg.strBadge && (
                      <Image
                        source={{ uri: lg.strBadge }}
                        className="w-20 h-20 mb-1"
                        resizeMode="contain"
                      />
                    )}
                  </View>
                  <Text className="text-center font-semibold text-sm mt-1">
                    {lg.strLeague}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Fanarts extras */}
        <View className="my-4">
          <Text className="text-xl font-bold mb-2 text-gray-800">Galeria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[team.strFanart2, team.strFanart3, team.strFanart4]
              .filter(Boolean)
              .map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  className="w-80 h-80 rounded-xl mr-3"
                  resizeMode="cover"
                />
              ))}
          </ScrollView>
        </View>

        {/* Informações do estádio */}
        {venue && (
          <View className="my-4">
            <Text className="text-xl font-semibold mb-2">{venue.strVenue}</Text>
            <Text className="text-base text-gray-700 mb-3">
              {venue.strDescriptionEN}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
            >
              {[
                venue.strFanart1,
                venue.strFanart2,
                venue.strFanart3,
                venue.strFanart4,
              ]
                .filter(Boolean)
                .map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    style={{ width: 300, height: 180, borderRadius: 10 }}
                  />
                ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

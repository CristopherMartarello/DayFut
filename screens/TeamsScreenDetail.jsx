// TeamDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
  FlatList,
} from "react-native";
import InfoCard from "../components/InfoCard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CommentSection from "../components/CommentSection";
import { useTheme } from "../context/ThemeContext";

export default function TeamDetailsScreen({ route }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { team } = route.params;
  const [flag, setFlag] = useState(null);
  const [normalizedString, setNormalizedString] = useState("");

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

  return (
    <FlatList
      data={[]}
      keyExtractor={() => "key"}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View className={`${isDark ? "bg-zinc-900" : "bg-gray-100"}`}>
          {team.strFanart1 && (
            <Image
              source={{ uri: team.strFanart1 }}
              className="w-full h-96"
              resizeMode="cover"
            />
          )}

          <View
            className={`mt-[-18px] p-6 rounded-t-3xl shadow-lg z-10 ${
              isDark ? "bg-zinc-800" : "bg-white"
            }`}
          >
            <Text
              className={`text-3xl font-bold mb-2 ${
                isDark ? "text-white" : "text-zinc-800"
              }`}
            >
              {team.strTeam}
            </Text>

            <Text
              className={`mb-4 text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {team.strDescriptionEN ||
                team.strStadiumDescription ||
                "Sem descrição."}
            </Text>

            <Text
              className="text-xl font-bold mb-2"
              style={{ color: isDark ? "#fff" : "#000" }}
            >
              Informações Gerais
            </Text>

            <View className="flex-row justify-center gap-3">
              <View
                className={`items-center p-4 rounded-xl mb-4 w-24 ${
                  isDark ? "bg-zinc-700" : "bg-gray-100"
                }`}
              >
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

            <Text
              className="text-base mb-1"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              <Text className="font-semibold">Fundado em:</Text>{" "}
              {team.intFormedYear}
            </Text>
            <Text
              className="text-base mb-1"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              <Text className="font-semibold">Estádio:</Text> {team.strStadium}{" "}
              ({team.intStadiumCapacity} lugares)
            </Text>
            <Text
              className="text-base mb-1"
              style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            >
              <Text className="font-semibold">Localização:</Text>{" "}
              {team.strLocation}
            </Text>

            <View className="flex-row flex-wrap mb-1">
              <Text
                className="text-base font-semibold"
                style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
              >
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

            {/* Galeria */}
            <View className="my-4">
              <Text
                className="text-xl font-bold mb-2"
                style={{ color: isDark ? "#fff" : "#000" }}
              >
                Galeria
              </Text>
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
          </View>
        </View>
      }
      ListFooterComponent={
        <View className={`${isDark ? "bg-zinc-900" : "bg-white"}`}>
          <CommentSection itemId={team.idTeam} itemType="team" />
        </View>
      }
    />
  );
}

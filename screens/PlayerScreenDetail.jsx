import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from "../api/api";
import InfoCard from "../components/InfoCard";
import CommentSection from "../components/CommentSection";
import { useTheme } from "../context/ThemeContext";

export default function PlayerDetailsScreen({ route }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { player } = route.params;
  const [teamLogo, setTeamLogo] = useState(null);
  const [flag, setFlag] = useState(null);
  const [normalizedString, setNormalizedString] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamRes = await api.get(
          `/searchteams.php?t=${encodeURIComponent(player.strTeam)}`
        );
        const team = teamRes.data.teams?.[0];
        if (team?.strBadge) setTeamLogo(team.strBadge);

        const correctedName = normalizeNationality(player.strNationality);
        setNormalizedString(correctedName);

        const countryRes = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            correctedName
          )}?fullText=true`
        );
        const countryData = await countryRes.json();
        const flagUrl = countryData?.[0]?.flags?.png;
        if (flagUrl) setFlag(flagUrl);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const shirtNumber =
    player.strNumber && Number(player.strNumber) < 10
      ? `0${player.strNumber}`
      : player.strNumber || "?";

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

    const cleanName = nationality.replace(/^the\s+/i, "").trim();
    return exceptions[cleanName] || cleanName;
  };

  return (
    <FlatList
      data={[]} // usar FlatList como container
      keyExtractor={() => "key"}
      ListHeaderComponent={
        <View className={`${isDark ? "bg-zinc-900" : "bg-gray-100"}`}>
          {player.strThumb && (
            <Image
              source={{ uri: player.strThumb }}
              className="w-full h-96"
              resizeMode="cover"
            />
          )}

          <View
            className={`mt-[-18px] rounded-t-3xl p-6 shadow-lg z-10 ${
              isDark ? "bg-zinc-800" : "bg-white"
            }`}
          >
            <Text
              className={`text-3xl font-bold mb-2 ${
                isDark ? "text-white" : "text-zinc-800"
              }`}
            >
              {player.strPlayer}
            </Text>

            <Text
              className={`mb-4 text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {player.strDescriptionBR ?? player.strDescriptionEN}
            </Text>

            <View className="flex-row justify-center gap-3">
              <InfoCard imageUri={teamLogo} text={player.strTeam} />
              <InfoCard
                icon={<Icon name="tshirt-crew" size={40} color="#2563eb" />}
                text={shirtNumber}
              />
              <InfoCard imageUri={flag} text={normalizedString} />
              <InfoCard
                icon={<Icon name="run-fast" size={40} color="#2563eb" />}
                text={player.strPosition}
              />
            </View>

            <Text
              className={`text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-1`}
            >
              Nascimento: {player.dateBorn} - {player.strBirthLocation}
            </Text>
            <Text
              className={`text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-1`}
            >
              Altura: {player.strHeight} | Peso: {player.strWeight}
            </Text>
            <Text
              className={`text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-1`}
            >
              Gênero: {player.strGender === "Male" ? "Masculino" : "Feminino"}
            </Text>
            <Text
              className={`text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-1`}
            >
              Pé Dominante: {player.strSide === "Left" ? "Esquerdo" : "Direito"}
            </Text>
            <Text
              className={`text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-1`}
            >
              Situação: {player.strStatus || "Ativo"}
            </Text>
            <Text
              className={`text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-1`}
            >
              Contrato: {player.strSigning || "Desconhecido"}
            </Text>
            <Text
              className={`text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              } mb-1`}
            >
              Kit: {player.strKit || "Desconhecido"}
            </Text>
          </View>
        </View>
      }
      ListFooterComponent={
        <View className={`${isDark ? "bg-zinc-900" : "bg-white"}`}>
          <CommentSection itemId={player.idPlayer} itemType="player" />
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

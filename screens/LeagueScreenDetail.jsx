import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, FlatList } from "react-native";
import api from "../api/api";
import InfoCard from "../components/InfoCard";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SocialLink from "../components/SocialLink";
import CommentSection from "../components/CommentSection";
import { useTheme } from "../context/ThemeContext";

export default function LeagueDetailsScreen({ route }) {
  const { leagueId } = route.params;
  const [league, setLeague] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const res = await api.get(`/lookupleague.php?id=${leagueId}`);
        setLeague(res.data.leagues?.[0]);
      } catch (error) {
        console.error("Erro ao buscar liga:", error);
      }
    };

    fetchLeague();
  }, [leagueId]);

  if (!league) return null;

  return (
    <FlatList
      data={[]}
      keyExtractor={() => "static"}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View className={isDark ? "bg-zinc-900" : "bg-gray-100"}>
          {league.strFanart1 && (
            <Image
              source={{ uri: league.strFanart1 }}
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
                isDark ? "text-white" : "text-black"
              }`}
            >
              {league.strLeague}
            </Text>

            <Text
              className={`mb-4 text-base ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {league.strDescriptionEN || "Sem descrição disponível."}
            </Text>

            <Text
              className={`text-xl font-bold mb-2 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Informações Gerais
            </Text>

            <View className="flex-row justify-center gap-3 mb-4">
              <InfoCard
                icon={<Icon name="calendar" size={40} color="#2563eb" />}
                text={`${league.intFormedYear}`}
              />
              <InfoCard
                icon={<Icon name="map-marker" size={40} color="#2563eb" />}
                text={league.strCountry}
              />
              <InfoCard
                imageUri={league.strBadge}
                text={
                  league.strSport === "Soccer" ? "Futebol" : league.strSport
                }
              />
            </View>

            <Text
              className={`text-base mb-1 ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              <Text className="font-semibold">Temporada atual:</Text>{" "}
              {league.strCurrentSeason}
            </Text>
            <Text
              className={`text-base mb-1 ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              <Text className="font-semibold">Esporte:</Text>{" "}
              {league.strSport === "Soccer" ? "Futebol" : league.strSport}
            </Text>

            {/* Troféu e Banner */}
            <View className="mt-6 flex-col justify-center items-center">
              {league.strTrophy && (
                <Image
                  source={{ uri: league.strTrophy }}
                  className="w-full h-64"
                  resizeMode="contain"
                />
              )}
              {league.strBanner && (
                <Image
                  source={{ uri: league.strBanner }}
                  className="w-full h-48 rounded-full"
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Redes Sociais */}
            <Text
              className={`text-xl font-bold mb-2 mt-6 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Redes Sociais
            </Text>
            <SocialLink label="Website" url={league.strWebsite} />
            <SocialLink label="Facebook" url={league.strFacebook} />
            <SocialLink label="Instagram" url={league.strInstagram} />
            <SocialLink label="Twitter" url={league.strTwitter} />
            <SocialLink label="YouTube" url={league.strYoutube} />
            <SocialLink label="RSS" url={league.strRSS} />

            {/* Galeria */}
            <View className="my-4">
              <Text
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Galeria
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[league.strFanart2, league.strFanart3, league.strFanart4]
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
          <CommentSection itemId={league.idLeague} itemType="league" />
        </View>
      }
    />
  );
}

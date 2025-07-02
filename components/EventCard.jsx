import { Image, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

const EventCard = ({ item }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      className={`${
        isDark ? "bg-zinc-600" : "bg-white"
      } rounded-xl p-4 my-4 shadow-sm`}
    >
      <Text
        className={`text-lg font-semibold text-center mb-2 ${
          isDark ? "text-white" : "text-zinc-800"
        }`}
      >
        {item.strEvent}
      </Text>

      <View className="flex-row justify-around items-center m-4 shadow-sm">
        <Image
          source={{ uri: item.strHomeTeamBadge }}
          className="w-12 h-12"
          resizeMode="contain"
        />
        <Text
          className={`text-base font-bold ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          vs
        </Text>
        <Image
          source={{ uri: item.strAwayTeamBadge }}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </View>

      <Text
        className={`text-center mt-2 ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {item.dateEvent} - {item.strTime}
      </Text>
      <Text
        className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        {item.strVenue}
      </Text>
    </View>
  );
};

export default EventCard;

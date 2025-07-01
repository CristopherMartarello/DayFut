import { Image, Text, View } from "react-native";

const EventCard = ({ item }) => {
  console.log(item);
  return (
    <View className="bg-white rounded-xl p-4 mb-4">
      <Text className="text-lg font-semibold text-center mb-2">
        {item.strEvent}
      </Text>
      <View className="flex-row justify-around items-center m-4 shadow-sm">
        <Image
          source={{ uri: item.strHomeTeamBadge }}
          className="w-12 h-12"
          resizeMode="contain"
        />
        <Text className="text-base font-bold">vs</Text>
        <Image
          source={{ uri: item.strAwayTeamBadge }}
          className="w-12 h-12"
          resizeMode="contain"
        />
      </View>
      <Text className="text-center text-gray-600 mt-2">
        {item.dateEvent} - {item.strTime}
      </Text>
      <Text className="text-center text-gray-500">{item.strVenue}</Text>
    </View>
  );
};

export default EventCard;

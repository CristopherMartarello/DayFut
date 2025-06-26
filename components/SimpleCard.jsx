import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SimpleCard = ({ text = "Card", icon, onPress }) => {
  return (
    <TouchableOpacity
      className="w-11/12 h-52 bg-white rounded-xl items-center justify-center"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={32} color="#3b82f6" />
      <Text className="mt-2 text-blue-800 font-semibold">{text}</Text>
    </TouchableOpacity>
  );
};

export default SimpleCard;

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import SimpleCard from "../components/SimpleCard";

export default function HomeScreen({ navigation }) {
  return (
    <View className="flex-1 bg-zinc-100 p-4 justify-between">
      <ScrollView contentContainerStyle={{ gap: 16 }}>
        <Text className="text-2xl flex justify-center items-center font-bold text-zinc-800 mb-4">
          Olá, seja bem-vindo 👋
        </Text>

        <View className="flex-col gap-4 justify-center items-center">
          <SimpleCard
            text="Jogadores"
            icon={"person"}
            onPress={() => navigation.navigate("Jogadores")}
          />
          <SimpleCard text="Times" icon={"shirt"} />
          <SimpleCard text="Campeonatos" icon={"football"} />
        </View>
      </ScrollView>

      <Button
        mode="contained"
        buttonColor="#3b82f6"
        textColor="white"
        onPress={() => signOut(auth)}
      >
        Sair
      </Button>
    </View>
  );
}

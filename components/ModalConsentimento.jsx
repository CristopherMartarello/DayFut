import React from "react";
import { Modal, View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function ModalConsentimento({ visible, onAccept, onDecline }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/60 justify-center items-center px-4">
        <View className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-h-[90%] w-full">
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-xl font-bold mb-4 text-zinc-800 dark:text-white">
              Termo de Consentimento para Uso do Aplicativo
            </Text>

            <Text className="text-zinc-700 dark:text-zinc-300 mb-4">
              Este Termo de Consentimento tem como objetivo informar o(a)
              usuário(a) sobre a coleta e uso de dados pessoais pelo aplicativo,
              de forma transparente e em conformidade com a legislação vigente
              (Lei Geral de Proteção de Dados - LGPD, nº 13.709/2018).
            </Text>

            <Text className="font-semibold mb-1 text-zinc-800 dark:text-white">
              Dados Coletados:
            </Text>
            <Text className="text-zinc-700 dark:text-zinc-300 mb-4">
              - Nome{"\n"}- Email{"\n"}- Jogadores, times e campeonatos
              favoritos{"\n"}- Descrições inseridas manualmente
            </Text>

            <Text className="font-semibold mb-1 text-zinc-800 dark:text-white">
              Finalidade da Coleta:
            </Text>
            <Text className="text-zinc-700 dark:text-zinc-300 mb-4">
              As informações são utilizadas exclusivamente para personalizar a
              sua experiência no app, exibir conteúdos com base em preferências,
              salvar favoritos e registrar anotações.
            </Text>

            <Text className="font-semibold mb-1 text-zinc-800 dark:text-white">
              Armazenamento e Segurança:
            </Text>
            <Text className="text-zinc-700 dark:text-zinc-300 mb-4">
              Seus dados são armazenados com segurança e não serão
              compartilhados com terceiros, exceto por exigência legal.
            </Text>

            <Text className="font-semibold mb-1 text-zinc-800 dark:text-white">
              Limitações Técnicas:
            </Text>
            <Text className="text-zinc-700 dark:text-zinc-300 mb-4">
              Esta aplicação utiliza a API gratuita do TheSportsDB, que possui
              um limite de requisições. Em caso de uso excessivo, você pode
              encontrar o erro 429, que indica que o limite foi atingido. Caso
              isso ocorra, aguarde alguns minutos e tente novamente.
            </Text>

            <Text className="font-semibold mb-1 text-zinc-800 dark:text-white">
              Comentários e Convivência:
            </Text>
            <Text className="text-zinc-700 dark:text-zinc-300 mb-6">
              O aplicativo permite comentários em diversas áreas. Pedimos que
              você mantenha uma postura respeitosa, educada e construtiva ao
              utilizar essas funções. Conteúdos ofensivos, discriminatórios ou
              abusivos poderão ser removidos.
            </Text>

            <Text className="text-zinc-800 dark:text-white font-medium mb-6">
              Ao pressionar "Li e concordo com o Termo", você declara estar
              ciente e de acordo com os termos acima.
            </Text>

            <View className="flex-col gap-2">
              <TouchableOpacity
                onPress={onAccept}
                className="bg-blue-600 rounded-xl py-3"
              >
                <Text className="text-white text-center font-bold text-base">
                  Li e concordo com o Termo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onDecline}
                className="bg-zinc-600 rounded-xl py-3"
              >
                <Text className="text-white text-center font-bold text-base">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

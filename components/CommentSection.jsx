import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { auth } from "../firebaseConfig";
import {
  addComment,
  deleteComment,
  updateComment,
  listenToComments,
} from "../services/commentsService";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

export default function CommentSection({ itemId, itemType }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const user = auth.currentUser;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Pegando o tema atual (light ou dark)
  const { theme } = useTheme();
  const isDark = theme === "dark"; // Verifica se o tema é dark

  useEffect(() => {
    const unsubscribe = listenToComments({
      itemId,
      itemType,
      callback: setComments,
    });

    return () => unsubscribe();
  }, [itemId, itemType]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    await addComment({
      userId: user.uid,
      userName: user.email.split("@")[0] || "Usuário",
      itemId,
      itemType,
      content: content.trim(),
    });

    setContent("");
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirmar", "Deseja excluir este comentário?", [
      { text: "Cancelar" },
      { text: "Excluir", onPress: () => deleteComment(id) },
    ]);
  };

  const handleOpenEdit = (id, currentContent) => {
    setEditingCommentId(id);
    setEditingContent(currentContent);
    setEditModalVisible(true);
  };

  const handleConfirmEdit = async () => {
    if (!editingContent.trim()) return;
    await updateComment(editingCommentId, editingContent.trim());
    setEditModalVisible(false);
    setEditingCommentId(null);
    setEditingContent("");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View className={`p-4 mb-6 ${isDark ? "bg-zinc-800" : "bg-white"}`}>
      <Text
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        Comentários
      </Text>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`flex-row gap-3 m-1 items-start ${
              isDark ? "bg-gray-700" : "bg-white"
            } p-4 rounded-xl mb-3 shadow-sm`}
          >
            {/* Avatar */}
            <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
              <Icon name="account" size={24} color="white" />
            </View>

            {/* Conteúdo */}
            <View className="flex-1">
              <View className="flex-row justify-between">
                <Text
                  className={`font-semibold text-base ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.userName}
                </Text>
                <Text
                  className={`text-xs ${
                    isDark ? "text-white" : "text-gray-500"
                  }`}
                >
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              <View className="flex-row justify-between items-start">
                <Text
                  className={`text-sm ${
                    isDark ? "text-white" : "text-gray-700"
                  } flex-1 pr-2`}
                >
                  {item.content}
                </Text>
                {item.userId === user?.uid && (
                  <View className="flex-row gap-2 mt-1">
                    <TouchableOpacity
                      onPress={() => handleOpenEdit(item.id, item.content)}
                    >
                      <Icon
                        name="pencil"
                        size={16}
                        color={isDark ? "white" : "#4B5563"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Icon name="trash-can" size={16} color={"#DC2626"} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      />

      <View className="gap-2 p-1">
        <TextInput
          className={`border p-3 rounded-lg my-2 text-base ${
            isDark
              ? "text-white bg-gray-800 border-gray-600"
              : "text-black bg-white border-gray-300"
          }`}
          placeholder="Escreva um comentário..."
          placeholderTextColor={isDark ? "white" : "black"}
          value={content}
          onChangeText={setContent}
        />
        <Button mode="contained" onPress={handleSubmit} buttonColor="#3b82f6">
          Comentar
        </Button>
      </View>

      {/* Modal de edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View
          className={`flex-1 justify-center items-center ${
            isDark ? "bg-black/50" : "bg-black/40"
          } px-4`}
        >
          <View
            className={`bg-white rounded-xl p-4 w-full max-w-md ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <Text
              className={`text-lg font-bold mb-2 ${
                isDark
                  ? "text-white border-gray-600"
                  : "text-black border-gray-300"
              }`}
            >
              Editar Comentário
            </Text>
            <TextInput
              className={`border p-2 rounded ${
                isDark
                  ? "text-white bg-gray-700 border-gray-600"
                  : "text-black bg-gray-100 border-gray-300"
              } mb-4`}
              multiline
              value={editingContent}
              onChangeText={setEditingContent}
            />
            <View className="flex-row justify-end gap-3">
              <Pressable onPress={() => setEditModalVisible(false)}>
                <Text className={isDark ? "text-white" : "text-gray-500"}>
                  Cancelar
                </Text>
              </Pressable>
              <Pressable onPress={handleConfirmEdit}>
                <Text className="text-blue-400 font-medium">Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

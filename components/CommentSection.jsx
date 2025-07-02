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

export default function CommentSection({ itemId, itemType }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const user = auth.currentUser;

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

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
    <View className="p-4 mb-6">
      <Text className="text-2xl font-bold mb-4">Comentários</Text>

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row gap-3 m-1 items-start bg-white p-4 rounded-xl mb-3 shadow-sm">
            {/* Avatar */}
            <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
              <Icon name="account" size={24} color="white" />
            </View>

            {/* Conteúdo */}
            <View className="flex-1">
              <View className="flex-row justify-between">
                <Text className="font-semibold text-base text-gray-800">
                  {item.userName}
                </Text>
                <Text className="text-xs text-gray-500">
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              <View className="flex-row justify-between items-start">
                <Text className="text-sm text-gray-700 flex-1 pr-2">
                  {item.content}
                </Text>
                {item.userId === user?.uid && (
                  <View className="flex-row gap-2 mt-1">
                    <TouchableOpacity
                      onPress={() => handleOpenEdit(item.id, item.content)}
                    >
                      <Icon name="pencil" size={16} color="#4B5563" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Icon name="trash-can" size={16} color="#DC2626" />
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
          className="border p-3 rounded-lg bg-white my-2 text-base"
          placeholder="Escreva um comentário..."
          value={content}
          onChangeText={setContent}
        />
        <Button mode="contained" onPress={handleSubmit}>
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
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-xl p-4 w-full max-w-md">
            <Text className="text-lg font-bold mb-2">Editar Comentário</Text>
            <TextInput
              className="border p-2 rounded bg-gray-100 mb-4"
              multiline
              value={editingContent}
              onChangeText={setEditingContent}
            />
            <View className="flex-row justify-end gap-3">
              <Pressable onPress={() => setEditModalVisible(false)}>
                <Text className="text-gray-500">Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleConfirmEdit}>
                <Text className="text-blue-600 font-medium">Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

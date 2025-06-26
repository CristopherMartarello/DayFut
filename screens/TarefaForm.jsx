import React, { useEffect, useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function TarefaForm({ navigation, route }) {
  const { usuarioId, tarefa } = route.params;
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao);
    }
  }, [tarefa]);

  const salvarTarefa = async () => {
    if (tarefa) {
      await updateDoc(doc(db, 'tarefas', tarefa.id), { titulo, descricao });
    } else {
      await addDoc(collection(db, 'tarefas'), {
        titulo,
        descricao,
        usuarioId
      });
    }
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Descrição" value={descricao} onChangeText={setDescricao} style={{ marginBottom: 10 }} />
      <Button title="Salvar" onPress={salvarTarefa} />
    </View>
  );
}

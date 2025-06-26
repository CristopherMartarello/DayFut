import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default function TarefaList({ navigation, route }) {
  const { usuarioId } = route.params;
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'tarefas'), where('usuarioId', '==', usuarioId));
    const unsubscribe = onSnapshot(q, snapshot => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTarefas(lista);
    });

    return () => unsubscribe();
  }, []);

  const removerTarefa = async (id) => {
    await deleteDoc(doc(db, 'tarefas', id));
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Nova Tarefa" onPress={() => navigation.navigate('Nova Tarefa', { usuarioId })} />
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.titulo}: {item.descricao}</Text>
            <Button title="Editar" onPress={() => navigation.navigate('Nova Tarefa', { tarefa: item, usuarioId })} />
            <Button title="Excluir" onPress={() => removerTarefa(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

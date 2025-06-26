import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function UsuarioForm({ navigation, route }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const usuario = route.params?.usuario;

  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome);
      setEmail(usuario.email);
    }
  }, [usuario]);

  const salvarUsuario = async () => {
    if (usuario) {
      await updateDoc(doc(db, 'usuarios', usuario.id), { nome, email });
    } else {
      await addDoc(collection(db, 'usuarios'), { nome, email });
    }
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 10 }} />
      <Button title="Salvar" onPress={salvarUsuario} />
    </View>
  );
}

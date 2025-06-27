import React, { useState } from "react";
import { View, TextInput, Button, Platform, Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Alerta compatível com web e mobile
const mostrarAlerta = (titulo, mensagem) => {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");

  const fazerLogin = async () => {
    if (!email || !senha) {
      mostrarAlerta("Erro", "Preencha e-mail e senha");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        mostrarAlerta("Erro", "E-mail inválido.");
      } else if (error.code === "auth/user-not-found") {
        mostrarAlerta("Erro", "Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        mostrarAlerta("Erro", "Senha incorreta.");
      } else {
        mostrarAlerta("Erro", "Falha ao entrar: " + error.message);
      }
    }
  };

  const registrar = async () => {
    if (!email || !senha || !nome) {
      mostrarAlerta("Erro", "Preencha e-mail e senha");
      return;
    }

    if (senha.length < 6) {
      mostrarAlerta("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nome,
        email,
        criadoEm: new Date(),
      });

      mostrarAlerta("Sucesso", "Conta criada com sucesso!");
    } catch (error) {
      mostrarAlerta("Erro ao registrar", error.message);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 40 }}>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ marginBottom: 10 }}
      />
      <Button title="Entrar" onPress={fazerLogin} />
      <Button title="Criar Conta" onPress={registrar} />
    </View>
  );
}

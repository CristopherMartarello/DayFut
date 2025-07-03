import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Switch,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import ModalConsentimento from "../components/ModalConsentimento";

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
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mostrarTermo, setMostrarTermo] = useState(false);

  const fazerLogin = async () => {
    if (!email || !senha) {
      mostrarAlerta("Erro", "Preencha e-mail e senha");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      mostrarAlerta("Sucesso", "Login realizado com sucesso!");
    } catch (error) {
      const mensagens = {
        "auth/invalid-email": "E-mail inválido.",
        "auth/user-not-found": "Usuário não encontrado.",
        "auth/wrong-password": "Senha incorreta.",
      };
      mostrarAlerta("Erro", mensagens[error.code] || error.message);
    }
  };

  const registrar = async () => {
    if (!email || !senha || !nome) {
      mostrarAlerta("Erro", "Preencha todos os campos");
      return;
    }

    if (!aceitouTermos) {
      mostrarAlerta(
        "Termos de Uso",
        "Você deve aceitar os termos para continuar."
      );
      setMostrarTermo(true);
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
    <View className="flex-1 justify-center px-6 bg-white dark:bg-zinc-900">
      <Text className="text-3xl font-bold text-center mb-6 text-zinc-800 dark:text-white">
        Bem-vindo!
      </Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-4 rounded-xl mb-4"
        placeholderTextColor="#9ca3af"
      />
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-4 rounded-xl mb-4"
        placeholderTextColor="#9ca3af"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white p-4 rounded-xl mb-4"
        placeholderTextColor="#9ca3af"
      />

      {/* Botões */}
      <TouchableOpacity
        className="bg-blue-600 rounded-xl py-4 mb-3"
        onPress={fazerLogin}
      >
        <Text className="text-white font-bold text-center text-base">
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-zinc-700 rounded-xl py-4"
        onPress={registrar}
      >
        <Text className="text-white font-bold text-center text-base">
          Criar Conta
        </Text>
      </TouchableOpacity>

      <ModalConsentimento
        visible={mostrarTermo}
        onAccept={() => {
          setAceitouTermos(true);
          setMostrarTermo(false);
          // registrar();
        }}
        onDecline={() => {
          setMostrarTermo(false);
          setAceitouTermos(false);
        }}
      />
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import LoginScreen from './screens/LoginScreen';
import UsuarioList from './screens/UsuarioList';
import UsuarioForm from './screens/UsuarioForm';
import TarefaList from './screens/TarefaList';
import TarefaForm from './screens/TarefaForm';

const Stack = createNativeStackNavigator();

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUsuarioLogado(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {usuarioLogado ? (
          <>
            <Stack.Screen name="Usuários" component={UsuarioList} />
            <Stack.Screen name="Novo Usuário" component={UsuarioForm} />
            <Stack.Screen name="Tarefas" component={TarefaList} />
            <Stack.Screen name="Nova Tarefa" component={TarefaForm} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

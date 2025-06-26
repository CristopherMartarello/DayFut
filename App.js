import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PlayerScreen from './screens/PlayerScreen';
import PlayerDetailsScreen from './screens/PlayerScreenDetail';
import "./globals.css";

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
    <PaperProvider>

      <NavigationContainer>
        <Stack.Navigator>
          {usuarioLogado ? (
            <>
              <Stack.Screen name="DayFut" component={HomeScreen} />
              <Stack.Screen name="Jogadores" component={PlayerScreen} />
              <Stack.Screen name="Jogador" component={PlayerDetailsScreen} />
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
    </PaperProvider>
  );
}

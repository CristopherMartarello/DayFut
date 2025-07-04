import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import LoginScreen from './screens/LoginScreen';
import PlayerDetailsScreen from './screens/PlayerScreenDetail';
import LeagueScreenDetail from './screens/LeagueScreenDetail';
import BottomTabs from './components/BottomTabs';
import "./globals.css";
import TeamsScreenDetail from './screens/TeamsScreenDetail';
import { ThemeProvider } from './context/ThemeContext';
import { Provider } from "react-redux";
import { store } from "./redux/store";

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
      <ThemeProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator>
              {usuarioLogado ? (
                <>
                  <Stack.Screen name="Home" component={BottomTabs} options={{ headerShown: false }} />
                  <Stack.Screen name="Jogador" component={PlayerDetailsScreen} />
                  <Stack.Screen name="Liga" component={LeagueScreenDetail} />
                  <Stack.Screen name="Time" component={TeamsScreenDetail} />
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
        </Provider>
      </ThemeProvider>
    </PaperProvider>
  );
}

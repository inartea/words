// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import NotFoundScreen from "../screens/NotFoundScreen";
import MainScreen from "../src/screens/MainScreen";
import MultiplayerScreen from "../src/screens/MultiplayerScreen";
import EndGameScreen from "../src/screens/EndGameScreen";
import QuickGameScreen from "../src/screens/QuickGameScreen";
import GameScreen from "../src/screens/GameScreen";

export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Multiplayer" component={MultiplayerScreen} />
      <Stack.Screen name="QuickGame" component={QuickGameScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="EndGame" component={EndGameScreen} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}

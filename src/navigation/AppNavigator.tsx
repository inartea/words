// src/navigation/AppNavigator.tsx


export type RootStackParamList = {
  MainScreen: undefined;
  MultiplayerScreen: undefined;
  EndGameScreen: undefined;
  QuickGameScreen: undefined;
};

export interface Player {
  name: string;
  score: number;
  words: string[];
  bestWord: string;
  totalTime: number;
}


export type RootStackParamList = {
    MainScreen: undefined;
    MultiplayerScreen: undefined;
    EndGameScreen: undefined;
    QuickGameScreen: undefined;
};

export interface Game {
    players: Player[];
    winner: Player;
    bestWord: string;
    duration: number;
    playerThinkingTime: number;
}
  
export interface Player {
    name: string;
    score: number;
    words: string[];
    bestWord: string;
    totalTime: number;
    lives: number;
}
  
  
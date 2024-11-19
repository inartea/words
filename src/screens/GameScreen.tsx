import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Animated,
  FlatList,
  Alert,
  StyleSheet,
  Easing,
  Dimensions,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Player } from "../types";
import Countdown from "../components/Countdown";

const GameScreen = ({ route }) => {
  const navigation = useNavigation();
  const [currentWord, setCurrentWord] = useState("");
  const [previousWord, setPreviousWord] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const { players, duration, playerThinkingTime = 10 } = route.params;
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const animatedValue = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [score, setScore] = useState<number>(0); // Scorul curent
  const opacityValue = useRef(new Animated.Value(0)).current; // Opacitatea
  const scaleValue = useRef(new Animated.Value(1)).current; // Scalarea
  const { width, height } = Dimensions.get("window"); // Dimensiunile ecranului
  const inputRef = useRef<TextInput>(null);
  const timerRef = useRef<{ resetTimer: () => void }>(null);
  const [playersStack, setPlayerStack] = useState<Player[]>([...players]);

  const calculateScore = (word: string) => {
    return word.length;
  };

  const handleWordSubmit = () => {
    // Validarea cuvântului
    const word = currentWord.toUpperCase();

    if (currentWord.length < 2) {
      Alert.alert("Eroare", "Introdu un cuvânt!");
      return;
    }

    if (usedWords.includes(word)) {
      Alert.alert("Eroare", "Cuvântul a fost deja folosit!");
      return;
    }

    if (
      previousWord &&
      previousWord.length &&
      word.charAt(0) !== previousWord.slice(-1)
    ) {
      Alert.alert(
        "Eroare",
        "Cuvântul trebuie să înceapă cu ultima literă a cuvântului precedent!"
      );
      return;
    }

    const currentPlayer = playersStack[0];
    const score = calculateScore(word);
    currentPlayer.bestWord =
      score > calculateScore(currentPlayer?.bestWord)
        ? word
        : currentPlayer.bestWord;
    currentPlayer.totalTime +=
      (new Date().getTime() - startTime.getTime()) / 1000;
    currentPlayer.score += score;

    // Actualizarea stării jocului
    setPreviousWord(word);
    setUsedWords([...usedWords, word]);
    setCurrentWord("");
    updateScore(score);

    updateCurrentPlayer(currentPlayer);
    nextPlayer();
  };

  const updateCurrentPlayer = (playerData: Player) => {
    players.map((p: Player) => {
      if (p.name === playersStack[0]?.name) {
        p = { ...p, ...playerData }; // Actualizează jucătorul curent
      }
    });
  };

  const handleReset = () => {
    if (timerRef.current) {
      timerRef.current.resetTimer(); // Apelează metoda resetTimer expusă
    }
  };

  const loseLife = () => {
    const currentPlayer = playersStack[0];
    currentPlayer.lives -= 1;

    if (currentPlayer.lives <= 0) {
      Alert.alert("Game Over", "Ai pierdut toate viețile!");
    }

    updateCurrentPlayer(currentPlayer);
  };

  const updateScore = (score: number) => {
    setScore(score);
    animateScore();
  };

  const animateScore = () => {
    // Calculăm pozițiile (start și final)
    const start = { x: width / 2, y: height / 2 }; // Poziția de start (centrul cuvântului curent)
    const end = { x: width / 2, y: height / 2 - 200 }; // Poziția de final (jucătorul activ)

    animatedValue.setValue(start);
    opacityValue.setValue(1); // Resetăm opacitatea
    scaleValue.setValue(1); // Resetăm scalarea

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: end,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0, // Fade-out
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 3.5, // Scalare
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const nextPlayer = () => {
    const currentPlayer = playersStack.shift() as Player;
    const playersWithLives = playersStack.filter((p) => p.lives > 0);

    console.log("Players with lives", playersWithLives);

    if (currentPlayer.lives > 0) {
      setPlayerStack([...playersWithLives, currentPlayer]);
    } else {
      setPlayerStack([...playersWithLives]);
    }

    if (playersWithLives.length <= 1) {
      endGame(navigation, players);
    } else {
      setStartTime(new Date());
      inputRef.current?.focus();
      if (timerRef.current) {
        timerRef.current.resetTimer(); // Apelează funcția resetTimer din CountdownTimer
      }
      updateCurrentPlayer(currentPlayer);
      handleReset();
    }
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const currentStyle =
      playersStack[0]?.name === item.name
        ? styles.playerActiveContainer
        : styles.playerDefaultContainer;
    return (
      <View style={item.lives > 0 ? currentStyle : styles.playerLostContainer}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerScore}>Score: {item.score}</Text>
        <Text style={styles.playerLives}>Lives: {item.lives}</Text>
      </View>
    );
  };

  const renderLetter = (letter: string, index: number) => (
    <View key={index} style={styles.letterBox}>
      <Text style={styles.letter}>{letter}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.gameTimer}>
          <Countdown
            initialTime={duration * 60}
            onTimeUp={() => {
              endGame(navigation, players);
            }}
          />
        </View>
        <View style={styles.playerTimer}>
          <Countdown
            ref={timerRef}
            initialTime={playerThinkingTime}
            onTimeUp={() => {
              loseLife();
              nextPlayer();
            }}
          />
        </View>
      </View>
      {/* Top Section: Players */}
      <View style={styles.topSection}>
        <FlatList
          data={players}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.name}
          numColumns={2} // Display 2 players per row
          contentContainerStyle={styles.playersList}
        />
      </View>

      <View style={styles.centerSection}>
        <View style={styles.previousWord}>
          {previousWord.toUpperCase().split("").map(renderLetter)}
        </View>
        <View style={styles.currentWordContainer}>
          {currentWord.toUpperCase().split("").map(renderLetter)}
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Introdu cuvântul"
          value={currentWord}
          onChangeText={setCurrentWord}
          onSubmitEditing={handleWordSubmit}
        />
      </View>

      {/* Animație scor */}
      <Animated.View
        style={[
          styles.animatedScore,
          {
            transform: [
              ...animatedValue.getTranslateTransform(),
              { scale: scaleValue }, // Scalarea
            ],
            opacity: opacityValue, // Fade-out
          },
        ]}
      >
        <Text style={styles.scoreText}>+{score}</Text>
      </Animated.View>
      <Button title="EndGame" onPress={() => endGame(navigation, players)} />
    </View>
  );
};

function endGame(navigation, players: any) {
  navigation.navigate("EndGame", { players });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  topSection: {
    flex: 2,
    padding: 10,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
  },
  playersList: {
    justifyContent: "space-evenly",
  },
  centerSection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  previousWord: {
    fontSize: 18,
    color: "#999",
    marginBottom: 10,

    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  currentWordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letterBox: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 18,
    width: "80%",
    textAlign: "center",
  },
  playersSection: {
    flex: 2,
    padding: 10,
    backgroundColor: "#e3f2fd",
  },
  playerActiveContainer: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    padding: 10,
    backgroundColor: "#f4fa56",
    borderRadius: 8,
    elevation: 2,
  },
  playerDefaultContainer: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    elevation: 2,
  },
  playerLostContainer: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    padding: 10,
    backgroundColor: "#bababa",
    borderRadius: 8,
    elevation: 2,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  playerScore: {
    fontSize: 14,
    color: "#888",
  },
  playerLives: {
    fontSize: 14,
    color: "#d32f2f",
  },
  lives: {
    textAlign: "center",
    fontSize: 16,
    color: "#d32f2f",
    marginTop: 10,
  },
  animatedScore: {
    position: "absolute",
    zIndex: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
  },
  gameTimer: {
    alignItems: "flex-start",
  },
  playerTimer: {
    alignItems: "flex-end",
  },
});

export default GameScreen;

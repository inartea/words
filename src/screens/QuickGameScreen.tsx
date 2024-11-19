import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const QuickGameScreen = () => {
  const navigation = useNavigation();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [gameOver, setGameOver] = useState(false);

  const players: Player[] = [
    { name: 'Jucător 1', score: 0, words: [], bestWord: '', totalTime: 0 },
    { name: 'Robot', score: 0, words: [], bestWord: '', totalTime: 0 },
  ];

  const calculateScore = (word: string) => word.charAt(0).toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1;

  const handleSubmitWord = () => {
    if (gameOver || !startTime) return;

    const currentPlayer = players[currentPlayerIndex];
    if (!currentWord || currentPlayer.words.includes(currentWord)) {
      Alert.alert("Cuvânt invalid", "Reintrodu cuvântul.");
      return;
    }

    const score = calculateScore(currentWord);
    currentPlayer.score += score;
    currentPlayer.words.push(currentWord);
    currentPlayer.bestWord = currentPlayer.bestWord && score > calculateScore(currentPlayer.bestWord)
      ? currentWord
      : currentPlayer.bestWord;
    currentPlayer.totalTime += (new Date().getTime() - startTime.getTime()) / 1000;

    if (currentPlayerIndex === players.length - 1) {
      setGameOver(true);
      navigation.navigate('EndGame', { players });
    } else {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
      setStartTime(new Date());
    }
    setCurrentWord('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gameOver) {
        setGameOver(true);
        navigation.navigate('EndGame', { players });
      }
    }, 180000); // 3 minute

    return () => clearTimeout(timer);
  }, [gameOver]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rândul lui {players[currentPlayerIndex].name}</Text>
      <TextInput
        style={styles.input}
        value={currentWord}
        onChangeText={setCurrentWord}
        placeholder="Introdu un cuvânt"
      />
      <Button title="Trimite" onPress={handleSubmitWord} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderColor: '#ccc' },
});

export default QuickGameScreen;

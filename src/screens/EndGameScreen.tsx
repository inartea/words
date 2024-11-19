import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/Button';

export default function EndGameScreen({route, navigation}) {
  const { players } = route.params;

  const winner = players.reduce((prev, current) => (prev.score > current.score ? prev : current));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.winnerText}>{winner.name} wins!</Text>
      <Text style={styles.scoreText}>Score: {winner.score}</Text>
      <CustomButton title="Play Again" onPress={() => navigation.navigate("Main")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  winnerText: { fontSize: 20, marginBottom: 10 },
  scoreText: { fontSize: 16, marginBottom: 20 },
});

// src/screens/MultiplayerScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { Player } from '../types';

export default function MultiplayerScreen({navigation}){
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);

  const [gameTime, setGameTime] = useState('1');

  const addPlayer = () => {
    if (playerName.trim() !== '' && players.length < 8) {
      setPlayers([...players, 
          {
            name: playerName.trim(),
            score: 0,
            words: [],
            bestWord: '',
            totalTime: 0,
            lives: 3,
          }]);
      setPlayerName('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game time</Text>
      <TextInput
        style={styles.input}
        placeholder="Game time"
        value={gameTime}
        onChangeText={setGameTime}
      />
      <Text style={styles.title}>Please add players</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter player name"
        value={playerName}
        onChangeText={setPlayerName}
      />
      <Button title="Add Player" onPress={addPlayer} />
      <FlatList
        data={players}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.playerName}>{item.name}</Text>}
      />
      <Button
        title="Start Game"
        onPress={() => {
          navigation.navigate('Game', { players, duration: parseInt(gameTime), playerThinkingTime: 30 });
        }}
        disabled={players.length < 2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  playerName: { fontSize: 18, marginTop: 8 },
});

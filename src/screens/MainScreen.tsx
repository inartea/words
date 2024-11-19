// src/screens/MainScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MainScreen'>;

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const createGame = () => {
    return { 
      players:  [
        { name: 'Jucător 1', score: 0, words: [], bestWord: '', totalTime: 0, lives: 3 },
        { name: 'Jucător 2', score: 0, words: [], bestWord: '', totalTime: 0, lives: 1 },
        { name: 'Jucător 3', score: 0, words: [], bestWord: '', totalTime: 0, lives: 0 },
        { name: 'Robot', score: 0, words: [], bestWord: '', totalTime: 0,     lives: 3 },
      ],
      duration :1 
    };
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>
      <Button title="Multiplayer" onPress={() => navigation.navigate('Multiplayer')} />
      <Button title="Play with AI" onPress={() => {navigation.navigate('Game', createGame())}} />
      <Button title="Tournament" onPress={() => {}} />
      <Button title="Scoreboard" onPress={() => {}} />
      <Button title="Performance" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default MainScreen;

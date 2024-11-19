// src/components/Button.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Player } from '../types';

interface PlayerProps{
  player: Player;
}

const PlayerComponent: React.FC<PlayerProps> = ({ player}) => (
  <Text style={styles.buttonText}>{player.name}</Text>
);

const styles = StyleSheet.create({
  button: { backgroundColor: '#3498db', padding: 12, borderRadius: 5, marginVertical: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default PlayerComponent;

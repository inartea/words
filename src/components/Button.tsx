// src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { backgroundColor: '#3498db', padding: 12, borderRadius: 5, marginVertical: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default CustomButton;

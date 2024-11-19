import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CountdownTimerProps {
  initialTime: number; // Timpul total în secunde
  onTimeUp: () => void; // Callback la expirarea timpului
}

const Countdown: React.FC<CountdownTimerProps> = forwardRef(({ initialTime, onTimeUp }:CountdownTimerProps, ref) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const onTimeUpRef = useRef(onTimeUp);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Actualizăm referința la callback
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Formatăm timpul în mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  // Funcție pentru resetarea cronometrului
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Oprire interval existent
    }

    setTimeLeft(initialTime); // Resetăm timpul la valoarea inițială
    startTimer(); // Repornim cronometru
  };

  // Expune funcția resetTimer către componenta părinte
   useImperativeHandle(ref, () => ({
     resetTimer,
   }));

  // Pornirea cronometrului
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeUp(); // Declanșăm callback-ul
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer(); // Pornește cronometrul la montare
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current); // Curățăm intervalul la demontare
    };
  }, []);

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Countdown;
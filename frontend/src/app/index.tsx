import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHealth } from '../services/api';

export default function HomeScreen() {
  const [message, setMessage] = useState('Press the button to test backend');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleCheck = async () => {
    try {
      setStatus('loading');
      setMessage('Checking backend...');

      const data = await getHealth();

      setStatus('success');
      setMessage(`${data.status}: ${data.message}`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Cannot connect to backend');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Smart Nutrition & Fitness Tracker</Text>
        <Text style={styles.subtitle}>Project startup check</Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text style={styles.statusText}>{message}</Text>
        </View>

        <Pressable style={styles.button} onPress={handleCheck}>
          <Text style={styles.buttonText}>Check Backend</Text>
        </Pressable>

        <Text style={styles.hint}>
          If this works, frontend and backend are connected correctly.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  statusBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f4f8',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 15,
    color: '#222',
  },
  button: {
    backgroundColor: '#1f6feb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});

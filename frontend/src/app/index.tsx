import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FoodLoggingScreen from './food-logging';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FoodLoggingScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    alignItems: 'center',
    padding: 16,
  },
});

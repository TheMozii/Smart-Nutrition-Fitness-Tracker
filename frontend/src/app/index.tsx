import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthScreen from './auth';
import FoodLoggingScreen from './food-logging';
import { useAuth } from '../features/auth/hooks';

export default function HomeScreen() {
  const { state, dispatch, submitAuth } = useAuth();

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthScreen state={state} dispatch={dispatch} onSubmit={submitAuth} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>Signed in as</Text>
          <Text style={styles.headerEmail}>{state.user.email}</Text>
        </View>
        <Pressable
          onPress={() => dispatch({ type: 'SIGN_OUT' })}
          style={styles.signOutButton}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <FoodLoggingScreen />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#d0d7de',
  },
  headerText: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  headerEmail: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#1f6feb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  signOutButtonText: {
    color: '#1f6feb',
    fontSize: 13,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
});

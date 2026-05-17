import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { AuthEvent, AuthState } from '../features/auth/types';

type AuthScreenProps = {
  state: AuthState;
  dispatch: (event: AuthEvent) => void;
  onSubmit: () => void;
};

export default function AuthScreen({ state, dispatch, onSubmit }: AuthScreenProps) {
  const isRegisterMode = state.mode === 'register';
  const isLoading = state.status === 'loading';

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {isRegisterMode ? 'Create Account' : 'Sign In'}
        </Text>
        <Text style={styles.subtitle}>
          Track meals, daily totals, and AI nutrition estimates.
        </Text>

        <TextInput
          placeholder="Email"
          value={state.email}
          onChangeText={(value) => dispatch({ type: 'TYPE_EMAIL', value })}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          value={state.password}
          onChangeText={(value) => dispatch({ type: 'TYPE_PASSWORD', value })}
          style={styles.input}
          secureTextEntry
        />

        {state.message ? (
          <View
            style={[
              styles.messageBox,
              state.status === 'error' && styles.errorBox,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                state.status === 'error' && styles.errorText,
              ]}
            >
              {state.message}
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={onSubmit}
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? 'Connecting...' : isRegisterMode ? 'Register' : 'Sign In'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => dispatch({ type: 'TOGGLE_MODE' })}
          style={[styles.secondaryButton, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>
            {isRegisterMode
              ? 'Already have an account? Sign in'
              : 'Need an account? Register'}
          </Text>
        </Pressable>

        <Text style={styles.note}>
          PocketBase authentication uses the users collection.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  messageBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#edf7ed',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    color: '#2e7d32',
  },
  errorBox: {
    backgroundColor: '#fff1f0',
  },
  errorText: {
    color: '#ff4d4f',
  },
  primaryButton: {
    backgroundColor: '#1f6feb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1f6feb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#1f6feb',
    fontSize: 14,
    fontWeight: '700',
  },
  note: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
});

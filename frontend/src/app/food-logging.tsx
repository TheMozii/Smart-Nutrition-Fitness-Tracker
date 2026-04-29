import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useFoodLogging } from '../features/food-logging/hooks';

export default function FoodLoggingScreen() {
  const { state, dispatch } = useFoodLogging();
  const statusText = buildStatusText(state.status, state.message);
  const statusStyle = buildStatusStyle(state.status);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Food Logging</Text>
        <Text style={styles.subtitle}>
          Search by food name or try a sample barcode.
        </Text>

        <TextInput
          placeholder="Enter food name"
          value={state.query}
          onChangeText={(value) => dispatch({ type: 'TYPE_NAME', value })}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => dispatch({ type: 'SUBMIT_SEARCH' })}
        />

        <Pressable
          onPress={() => dispatch({ type: 'SUBMIT_SEARCH' })}
          style={[styles.primaryButton, state.status === 'loading' && styles.buttonDisabled]}
          disabled={state.status === 'loading'}
        >
          <Text style={styles.primaryButtonText}>
            {state.status === 'loading' ? 'Searching...' : 'Search'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            dispatch({ type: 'SCAN_BARCODE', value: '1234567890123' });
            dispatch({ type: 'SUBMIT_SEARCH' });
          }}
          style={[styles.secondaryButton, state.status === 'loading' && styles.buttonDisabled]}
          disabled={state.status === 'loading'}
        >
          <Text style={styles.secondaryButtonText}>Scan Barcode</Text>
        </Pressable>

        <Text style={styles.helperText}>
          Demo action: the scan button uses a sample barcode.
        </Text>

        <View style={[styles.statusBox, statusStyle.box]}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={[styles.statusText, statusStyle.text]}>{statusText}</Text>
        </View>

        {state.food ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{state.food.name}</Text>
            <Text style={styles.resultRow}>Calories: {state.food.calories}</Text>
            <Text style={styles.resultRow}>Protein: {state.food.protein}g</Text>
            <Text style={styles.resultRow}>Carbs: {state.food.carbs}g</Text>
            <Text style={styles.resultRow}>Fats: {state.food.fats}g</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function buildStatusText(status: string, message: string | null) {
  if (message) {
    return message;
  }

  switch (status) {
    case 'loading':
      return 'Looking up nutrition information...';
    case 'success':
      return 'Nutrition information loaded.';
    case 'not_found':
      return "Information about this food couldn't be found.";
    case 'editing':
      return 'Ready to search.';
    default:
      return 'Enter a food name to begin.';
  }
}

function buildStatusStyle(status: string) {
  if (status === 'error') {
    return {
      box: styles.statusErrorBox,
      text: styles.statusErrorText,
    };
  }

  if (status === 'success') {
    return {
      box: styles.statusSuccessBox,
      text: styles.statusSuccessText,
    };
  }

  return {
    box: null,
    text: null,
  };
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
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
  primaryButton: {
    backgroundColor: '#1f6feb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#1f6feb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#1f6feb',
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 16,
  },
  statusBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f4f7fb',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666666',
  },
  statusErrorBox: {
    backgroundColor: '#fff1f0',
  },
  statusErrorText: {
    color: '#ff4d4f',
  },
  statusSuccessBox: {
    backgroundColor: '#edf7ed',
  },
  statusSuccessText: {
    color: '#2e7d32',
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f4f7fb',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 10,
  },
  resultRow: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 6,
  },
});

import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { FoodLoggingEvent, FoodLoggingState } from '../features/food-logging/types';

const DEMO_BARCODE = '3017624010701';

type FoodLoggingScreenProps = {
  state: FoodLoggingState;
  dispatch: (event: FoodLoggingEvent) => void;
};

export default function FoodLoggingScreen({
  state,
  dispatch,
}: FoodLoggingScreenProps) {
  const statusText = buildStatusText(state.status, state.message);
  const statusStyle = buildStatusStyle(state.status);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.title}>Food Logging</Text>
            <Text style={styles.subtitle}>
              Search, analyze, or scan a sample barcode.
            </Text>
          </View>
        </View>

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

        <View style={styles.actionRow}>
          <Pressable
            onPress={() => dispatch({ type: 'SUBMIT_SEARCH' })}
            style={[styles.primaryButton, state.status === 'loading' && styles.buttonDisabled]}
            disabled={state.status === 'loading'}
          >
            <Text style={styles.primaryButtonText} numberOfLines={1}>
              {state.status === 'loading' ? 'Searching...' : 'Search'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => dispatch({ type: 'SUBMIT_AI_ANALYSIS' })}
            style={[styles.secondaryButton, state.status === 'loading' && styles.buttonDisabled]}
            disabled={state.status === 'loading'}
          >
            <Text style={styles.secondaryButtonText} numberOfLines={1}>AI</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              dispatch({ type: 'SCAN_BARCODE', value: DEMO_BARCODE });
              dispatch({ type: 'SUBMIT_SEARCH' });
            }}
            style={[styles.secondaryButton, state.status === 'loading' && styles.buttonDisabled]}
            disabled={state.status === 'loading'}
          >
            <Text style={styles.secondaryButtonText} numberOfLines={1}>Barcode</Text>
          </Pressable>
        </View>

        <View style={[styles.statusBox, statusStyle.box]}>
          <Text style={[styles.statusText, statusStyle.text]}>{statusText}</Text>
        </View>

        {state.food ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{state.food.name}</Text>
            <Text style={styles.resultRow}>Calories: {state.food.calories}</Text>
            <Text style={styles.resultRow}>Protein: {state.food.protein}g</Text>
            <Text style={styles.resultRow}>Carbs: {state.food.carbs}g</Text>
            <Text style={styles.resultRow}>Fats: {state.food.fats}g</Text>
            {state.status === 'success' && state.message ? (
              <Text style={styles.resultNote}>{state.message}</Text>
            ) : null}
            <Pressable
              onPress={() =>
                dispatch({
                  type: 'ADD_FOOD_TO_DAILY_LOG',
                  loggedDate: new Date().toISOString(),
                })
              }
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add to Day</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Logged Foods</Text>

          {state.loggedFoods.length ? (
            <View style={styles.loggedFoodList}>
              {state.loggedFoods.map((food) => (
                <View key={food.id} style={styles.loggedFoodRow}>
                  <View style={styles.loggedFoodText}>
                    <Text style={styles.loggedFoodName}>{food.name}</Text>
                    <Text style={styles.loggedFoodMacros}>
                      {formatNutritionValue(food.calories)} cal · P {formatNutritionValue(food.protein)}g · C {formatNutritionValue(food.carbs)}g · F {formatNutritionValue(food.fats)}g
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      dispatch({
                        type: 'REMOVE_FOOD_FROM_DAILY_LOG',
                        id: food.id,
                      })
                    }
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptySummaryText}>
              No foods added yet.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function formatNutritionValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
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
    flex: 1,
    width: '100%',
  },
  screenContent: {
    padding: 12,
    paddingBottom: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 760,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  cardTitleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  primaryButton: {
    flex: 1.3,
    backgroundColor: '#1f6feb',
    borderRadius: 10,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1f6feb',
    borderRadius: 10,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1f6feb',
    fontSize: 14,
    fontWeight: '700',
  },
  statusBox: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f4f7fb',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 13,
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
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f4f7fb',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },
  resultRow: {
    fontSize: 13,
    color: '#222222',
    marginBottom: 4,
  },
  resultNote: {
    fontSize: 13,
    color: '#666666',
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  summarySection: {
    borderTopWidth: 1,
    borderTopColor: '#d0d7de',
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 10,
  },
  loggedFoodList: {
    gap: 6,
  },
  loggedFoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 10,
    padding: 10,
  },
  loggedFoodText: {
    flex: 1,
  },
  loggedFoodName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 4,
  },
  loggedFoodMacros: {
    fontSize: 12,
    color: '#666666',
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#ff4d4f',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  removeButtonText: {
    color: '#ff4d4f',
    fontSize: 12,
    fontWeight: '700',
  },
  emptySummaryText: {
    fontSize: 14,
    color: '#666666',
  },
});

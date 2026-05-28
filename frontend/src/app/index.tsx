import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthScreen from './auth';
import FoodLoggingScreen from './food-logging';
import { useAuth } from '../features/auth/hooks';
import { useFoodLogging } from '../features/food-logging/hooks';
import { FoodLoggingState, NutritionTotals } from '../features/food-logging/types';

export default function HomeScreen() {
  const { state, dispatch, submitAuth, continueWithDemoData } = useAuth();

  if (!state.user) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthScreen
          state={state}
          dispatch={dispatch}
          onSubmit={submitAuth}
          onDemoSubmit={continueWithDemoData}
        />
      </SafeAreaView>
    );
  }

  return (
    <SignedInHome
      email={state.user.email}
      userId={state.user.id}
      authToken={state.token ?? ''}
      onSignOut={() => dispatch({ type: 'SIGN_OUT' })}
    />
  );
}

type SignedInHomeProps = {
  email: string;
  userId: string;
  authToken: string;
  onSignOut: () => void;
};

function SignedInHome({
  email,
  userId,
  authToken,
  onSignOut,
}: SignedInHomeProps) {
  const { state, dispatch } = useFoodLogging({ authToken, userId });
  const [calorieTarget, setCalorieTarget] = useState('2200');
  const parsedCalorieTarget = parsePositiveNumber(calorieTarget) ?? 2200;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerLabel}>Signed in as</Text>
          <Text style={styles.headerEmail}>{email}</Text>
        </View>
        <Pressable
          onPress={onSignOut}
          style={styles.signOutButton}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </Pressable>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentBody}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        <Dashboard
          state={state}
          calorieTarget={parsedCalorieTarget}
          calorieTargetInput={calorieTarget}
          onChangeCalorieTarget={setCalorieTarget}
        />
        <FoodLoggingScreen state={state} dispatch={dispatch} />
      </ScrollView>
    </SafeAreaView>
  );
}

type DashboardProps = {
  state: FoodLoggingState;
  calorieTarget: number;
  calorieTargetInput: string;
  onChangeCalorieTarget: (value: string) => void;
};

function Dashboard({
  state,
  calorieTarget,
  calorieTargetInput,
  onChangeCalorieTarget,
}: DashboardProps) {
  const latestFood = state.loggedFoods[state.loggedFoods.length - 1];

  return (
    <View style={styles.dashboard}>
      <View style={styles.dashboardHeader}>
        <View style={styles.dashboardTitleGroup}>
          <Text style={styles.dashboardTitle}>Today</Text>
          <Text style={styles.dashboardSubtitle}>
            {state.loggedFoods.length
              ? `${state.loggedFoods.length} foods logged`
              : 'Start by logging a food'}
          </Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>
            {state.status === 'loading' ? 'Syncing' : 'Ready'}
          </Text>
        </View>
      </View>

      <View style={styles.metricGrid}>
        <DashboardMetric
          label="Calories"
          value={state.dailyTotals.calories}
          target={calorieTarget}
        />
        <DashboardMetric
          label="Protein"
          value={state.dailyTotals.protein}
          suffix="g"
        />
        <DashboardMetric label="Carbs" value={state.dailyTotals.carbs} suffix="g" />
        <DashboardMetric label="Fats" value={state.dailyTotals.fats} suffix="g" />
      </View>

      <WeeklyCaloriesChart state={state} />

      <View style={styles.goalRow}>
        <Text style={styles.goalLabel}>Calorie goal</Text>
        <TextInput
          value={calorieTargetInput}
          onChangeText={onChangeCalorieTarget}
          keyboardType="numeric"
          inputMode="numeric"
          style={styles.goalInput}
          maxLength={5}
        />
      </View>

      <View style={styles.dashboardFooter}>
        <Text style={styles.dashboardFooterText} numberOfLines={1}>
          {latestFood
            ? `Latest: ${latestFood.name} · ${formatNutritionValue(latestFood.calories)} cal`
            : state.message ?? 'No saved foods for today yet.'}
        </Text>
      </View>
    </View>
  );
}

type WeeklyCaloriesChartProps = {
  state: FoodLoggingState;
};

function WeeklyCaloriesChart({ state }: WeeklyCaloriesChartProps) {
  const maxCalories = Math.max(
    1,
    ...state.weeklyTotals.map((day) => day.totals.calories)
  );

  return (
    <View style={styles.weeklyChart}>
      <View style={styles.weeklyChartHeader}>
        <Text style={styles.weeklyChartTitle}>7-Day Calories</Text>
        <Text style={styles.weeklyChartValue}>
          {formatNutritionValue(maxCalories)} max
        </Text>
      </View>

      <View style={styles.barRow}>
        {state.weeklyTotals.map((day) => {
          const barHeight = Math.max(
            4,
            Math.round((day.totals.calories / maxCalories) * 54)
          );

          return (
            <View key={day.date} style={styles.barItem}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: barHeight }]} />
              </View>
              <Text style={styles.barLabel}>{day.label.slice(0, 1)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

type DashboardMetricProps = {
  label: keyof NutritionTotals | 'Calories' | 'Protein' | 'Carbs' | 'Fats';
  value: number;
  suffix?: string;
  target?: number;
};

function DashboardMetric({
  label,
  value,
  suffix = '',
  target,
}: DashboardMetricProps) {
  const progress = target ? Math.min(value / target, 1) : null;

  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>
        {formatNutritionValue(value)}
        {suffix}
      </Text>
      {progress !== null ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      ) : null}
    </View>
  );
}

function formatNutritionValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
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
    width: '100%',
  },
  contentBody: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  dashboard: {
    width: '100%',
    maxWidth: 760,
    backgroundColor: '#ffffff',
    padding: 14,
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 0,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  dashboardTitleGroup: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },
  dashboardSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#edf7ed',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPillText: {
    color: '#2e7d32',
    fontSize: 12,
    fontWeight: '700',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metricItem: {
    flexGrow: 1,
    flexBasis: 120,
    minHeight: 64,
    borderRadius: 10,
    backgroundColor: '#f4f7fb',
    padding: 10,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
  },
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: '#d0d7de',
    marginTop: 7,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#1f6feb',
  },
  weeklyChart: {
    borderTopWidth: 1,
    borderTopColor: '#d0d7de',
    marginTop: 10,
    paddingTop: 10,
  },
  weeklyChartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  weeklyChartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222222',
  },
  weeklyChartValue: {
    fontSize: 12,
    color: '#666666',
  },
  barRow: {
    height: 78,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  barTrack: {
    width: '100%',
    height: 58,
    maxWidth: 34,
    justifyContent: 'flex-end',
    borderRadius: 8,
    backgroundColor: '#e7edf5',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#1f6feb',
  },
  barLabel: {
    fontSize: 11,
    color: '#666666',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#d0d7de',
    marginTop: 10,
    paddingTop: 10,
  },
  goalLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#222222',
  },
  goalInput: {
    width: 86,
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: '#222222',
    backgroundColor: '#ffffff',
    textAlign: 'right',
  },
  dashboardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#d0d7de',
    marginTop: 10,
    paddingTop: 8,
  },
  dashboardFooterText: {
    fontSize: 12,
    color: '#666666',
  },
});

import { createEmptyWeeklyTotals, foodLoggingReducer } from './reducer';
import {
  DailyNutritionTotal,
  FoodLoggingCommand,
  FoodLoggingState,
  LoggedFood,
} from './types';

const initialState: FoodLoggingState = {
  status: 'idle',
  mode: 'idle',
  query: '',
  food: null,
  foodSource: null,
  loggedFoods: [],
  dailyTotals: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  },
  weeklyTotals: createEmptyWeeklyTotals(),
  nextLoggedFoodId: 1,
  message: null,
};

runTests();

function runTests() {
  testEmptySearchShowsValidationError();
  testSearchByNameCreatesFetchCommand();
  testAddFoodCreatesSaveCommand();
  testLoadingSavedFoodsCalculatesDailyTotalsAndLoadsWeeklyTotals();
  testDeletingFoodUpdatesTotalsAndLoadsWeeklyTotals();
  testWeeklyTotalsAreStored();
}

function testEmptySearchShowsValidationError() {
  const result = foodLoggingReducer(initialState, { type: 'SUBMIT_SEARCH' });

  assertEqual(result.state.status, 'error', 'empty search status');
  assertEqual(
    result.state.message,
    'Please enter a food name or scan a barcode.',
    'empty search message'
  );
  assertCommand(result.command, { type: 'NONE' });
}

function testSearchByNameCreatesFetchCommand() {
  const typed = foodLoggingReducer(initialState, {
    type: 'TYPE_NAME',
    value: ' apple',
  });
  const submitted = foodLoggingReducer(typed.state, { type: 'SUBMIT_SEARCH' });

  assertEqual(submitted.state.status, 'loading', 'search status');
  assertCommand(submitted.command, {
    type: 'FETCH_FOOD_BY_NAME',
    name: 'apple',
  });
}

function testAddFoodCreatesSaveCommand() {
  const state: FoodLoggingState = {
    ...initialState,
    status: 'success',
    food: {
      name: 'Apple',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fats: 0.3,
    },
    foodSource: 'open_food_facts',
  };

  const result = foodLoggingReducer(state, {
    type: 'ADD_FOOD_TO_DAILY_LOG',
    loggedDate: '2026-05-27T10:00:00.000Z',
  });

  assertEqual(result.state.nextLoggedFoodId, 2, 'next logged food id');
  assertCommand(result.command, {
    type: 'SAVE_FOOD_TO_POCKETBASE',
    food: {
      id: '1',
      name: 'Apple',
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fats: 0.3,
      source: 'open_food_facts',
      loggedDate: '2026-05-27T10:00:00.000Z',
    },
  });
}

function testLoadingSavedFoodsCalculatesDailyTotalsAndLoadsWeeklyTotals() {
  const result = foodLoggingReducer(initialState, {
    type: 'LOAD_SAVED_FOODS_SUCCESS',
    foods: [
      buildLoggedFood('1', 'Eggs', 160, 12, 1, 11),
      buildLoggedFood('2', 'Toast', 90, 3, 17, 1),
    ],
  });

  assertEqual(result.state.dailyTotals.calories, 250, 'loaded calories');
  assertEqual(result.state.dailyTotals.protein, 15, 'loaded protein');
  assertEqual(result.state.dailyTotals.carbs, 18, 'loaded carbs');
  assertEqual(result.state.dailyTotals.fats, 12, 'loaded fats');
  assertCommand(result.command, { type: 'LOAD_WEEKLY_TOTALS_FROM_POCKETBASE' });
}

function testDeletingFoodUpdatesTotalsAndLoadsWeeklyTotals() {
  const state: FoodLoggingState = {
    ...initialState,
    loggedFoods: [
      buildLoggedFood('1', 'Eggs', 160, 12, 1, 11),
      buildLoggedFood('2', 'Toast', 90, 3, 17, 1),
    ],
  };

  const result = foodLoggingReducer(state, {
    type: 'DELETE_FOOD_SUCCESS',
    id: '1',
  });

  assertEqual(result.state.loggedFoods.length, 1, 'remaining food count');
  assertEqual(result.state.dailyTotals.calories, 90, 'remaining calories');
  assertCommand(result.command, { type: 'LOAD_WEEKLY_TOTALS_FROM_POCKETBASE' });
}

function testWeeklyTotalsAreStored() {
  const weeklyTotals: DailyNutritionTotal[] = [
    {
      date: '2026-05-27',
      label: 'Wed',
      totals: {
        calories: 250,
        protein: 15,
        carbs: 18,
        fats: 12,
      },
    },
  ];

  const result = foodLoggingReducer(initialState, {
    type: 'LOAD_WEEKLY_TOTALS_SUCCESS',
    totals: weeklyTotals,
  });

  assertEqual(result.state.weeklyTotals, weeklyTotals, 'weekly totals');
  assertCommand(result.command, { type: 'NONE' });
}

function buildLoggedFood(
  id: string,
  name: string,
  calories: number,
  protein: number,
  carbs: number,
  fats: number
): LoggedFood {
  return {
    id,
    name,
    source: 'manual',
    loggedDate: '2026-05-27T10:00:00.000Z',
    calories,
    protein,
    carbs,
    fats,
  };
}

function assertCommand(actual: FoodLoggingCommand, expected: FoodLoggingCommand) {
  assertEqual(actual, expected, `command ${expected.type}`);
}

function assertEqual(actual: unknown, expected: unknown, label: string) {
  const actualJson = JSON.stringify(sortObjectKeys(actual));
  const expectedJson = JSON.stringify(sortObjectKeys(expected));

  if (actualJson !== expectedJson) {
    throw new Error(`${label}: expected ${expectedJson}, received ${actualJson}`);
  }
}

function sortObjectKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }

  if (typeof value !== 'object' || value === null) {
    return value;
  }

  return Object.keys(value)
    .sort()
    .reduce<Record<string, unknown>>((sorted, key) => {
      sorted[key] = sortObjectKeys((value as Record<string, unknown>)[key]);
      return sorted;
    }, {});
}

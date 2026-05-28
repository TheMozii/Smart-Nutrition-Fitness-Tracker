import { useEffect, useRef, useState } from 'react';
import {
  analyzeMealText,
  deleteFoodFromPocketBase,
  fetchFoodByBarcode,
  fetchFoodByName,
  loadSavedFoodsFromPocketBase,
  loadWeeklyTotalsFromPocketBase,
  saveFoodToPocketBase,
} from './service';
import { createEmptyWeeklyTotals, foodLoggingReducer } from './reducer';
import {
  FoodLoggingCommand,
  FoodLoggingEvent,
  FoodLoggingState,
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

type UseFoodLoggingOptions = {
  authToken: string;
  userId: string;
};

export function useFoodLogging({ authToken, userId }: UseFoodLoggingOptions) {
  const [state, setState] = useState<FoodLoggingState>(initialState);
  const [command, setCommand] = useState<FoodLoggingCommand>({ type: 'NONE' });
  const stateRef = useRef(state);

  function dispatch(event: FoodLoggingEvent) {
    const result = foodLoggingReducer(stateRef.current, event);
    stateRef.current = result.state;
    setState(result.state);
    setCommand(result.command);
  }

  useEffect(() => {
    let cancelled = false;

    async function runCommand() {
      if (command.type === 'NONE') {
        return;
      }

      const result = await runFoodLoggingCommand(command, authToken, userId);

      if (cancelled) {
        return;
      }

      if (result.type === 'success') {
        if (result.action === 'save_food') {
          dispatch({
            type: 'SAVE_FOOD_SUCCESS',
            food: result.food,
          });
          return;
        }

        if (result.action === 'load_saved_foods') {
          dispatch({
            type: 'LOAD_SAVED_FOODS_SUCCESS',
            foods: result.foods,
          });
          return;
        }

        if (result.action === 'delete_food') {
          dispatch({
            type: 'DELETE_FOOD_SUCCESS',
            id: result.id,
          });
          return;
        }

        if (result.action === 'load_weekly_totals') {
          dispatch({
            type: 'LOAD_WEEKLY_TOTALS_SUCCESS',
            totals: result.totals,
          });
          return;
        }

        dispatch({
          type: 'SEARCH_SUCCESS',
          food: result.food,
          source: result.source,
          message: result.message,
        });
        return;
      }

      if (result.type === 'not_found') {
        dispatch({ type: 'SEARCH_NOT_FOUND' });
        return;
      }

      dispatch({ type: 'SEARCH_ERROR', message: result.message });
    }

    runCommand();

    return () => {
      cancelled = true;
    };
  }, [command]);

  useEffect(() => {
    dispatch({ type: 'LOAD_SAVED_FOODS_START' });
  }, [authToken, userId]);

  return {
    state,
    dispatch,
  };
}

async function runFoodLoggingCommand(
  command: FoodLoggingCommand,
  authToken: string,
  userId: string
) {
  switch (command.type) {
    case 'FETCH_FOOD_BY_NAME':
      return fetchFoodByName(command.name);
    case 'FETCH_FOOD_BY_BARCODE':
      return fetchFoodByBarcode(command.barcode);
    case 'ANALYZE_MEAL_TEXT':
      return analyzeMealText(command.description);
    case 'SAVE_FOOD_TO_POCKETBASE':
      return saveFoodToPocketBase(command.food, authToken, userId);
    case 'LOAD_SAVED_FOODS_FROM_POCKETBASE':
      return loadSavedFoodsFromPocketBase(authToken, userId);
    case 'LOAD_WEEKLY_TOTALS_FROM_POCKETBASE':
      return loadWeeklyTotalsFromPocketBase(authToken, userId);
    case 'DELETE_FOOD_FROM_POCKETBASE':
      return deleteFoodFromPocketBase(command.id, authToken, userId);
    case 'NONE':
      throw new Error('No command to run.');
  }
}

import { useEffect, useRef, useState } from 'react';
import { analyzeMealText, fetchFoodByBarcode, fetchFoodByName } from './service';
import { foodLoggingReducer } from './reducer';
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
  loggedFoods: [],
  dailyTotals: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  },
  nextLoggedFoodId: 1,
  message: null,
};

export function useFoodLogging() {
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

      const result = await runFoodLoggingCommand(command);

      if (cancelled) {
        return;
      }

      if (result.type === 'success') {
        dispatch({
          type: 'SEARCH_SUCCESS',
          food: result.food,
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

  return {
    state,
    dispatch,
  };
}

async function runFoodLoggingCommand(command: FoodLoggingCommand) {
  switch (command.type) {
    case 'FETCH_FOOD_BY_NAME':
      return fetchFoodByName(command.name);
    case 'FETCH_FOOD_BY_BARCODE':
      return fetchFoodByBarcode(command.barcode);
    case 'ANALYZE_MEAL_TEXT':
      return analyzeMealText(command.description);
    case 'NONE':
      throw new Error('No command to run.');
  }
}

import { useEffect, useRef, useState } from 'react';
import { fetchFoodByBarcode, fetchFoodByName } from './service';
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

      const result =
        command.type === 'FETCH_FOOD_BY_NAME'
          ? await fetchFoodByName(command.name)
          : await fetchFoodByBarcode(command.barcode);

      if (cancelled) {
        return;
      }

      if (result.type === 'success') {
        dispatch({ type: 'SEARCH_SUCCESS', food: result.food });
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

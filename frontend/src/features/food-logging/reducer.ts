import {
  FoodLoggingEvent,
  FoodLoggingResult,
  FoodLoggingState,
  LoggedFood,
  DailyNutritionTotal,
  NutritionTotals,
} from './types';

export function foodLoggingReducer(
  state: FoodLoggingState,
  event: FoodLoggingEvent
): FoodLoggingResult {
  switch (event.type) {
    case 'TYPE_NAME': {
      const query = event.value.trimStart();

      return {
        state: {
          ...state,
          status: query ? 'editing' : 'idle',
          mode: 'name',
          query,
          food: null,
          foodSource: null,
          message: null,
        },
        command: { type: 'NONE' },
      };
    }

    case 'SCAN_BARCODE': {
      const barcode = event.value.trim();

      return {
        state: {
          ...state,
          status: barcode ? 'editing' : 'idle',
          mode: 'barcode',
          query: barcode,
          food: null,
          foodSource: null,
          message: null,
        },
        command: { type: 'NONE' },
      };
    }

    case 'SUBMIT_SEARCH': {
      const query = state.query.trim();

      if (!query) {
        return {
          state: {
            ...state,
            status: 'error',
            message: 'Please enter a food name or scan a barcode.',
            food: null,
            foodSource: null,
          },
          command: { type: 'NONE' },
        };
      }

      if (state.mode === 'barcode') {
        return {
          state: {
            ...state,
            status: 'loading',
            food: null,
            foodSource: null,
            message: null,
          },
          command: {
            type: 'FETCH_FOOD_BY_BARCODE',
            barcode: query,
          },
        };
      }

      return {
        state: {
          ...state,
          status: 'loading',
          food: null,
          foodSource: null,
          message: null,
        },
        command: {
          type: 'FETCH_FOOD_BY_NAME',
          name: query,
        },
      };
    }

    case 'SUBMIT_AI_ANALYSIS': {
      const description = state.query.trim();

      if (!description) {
        return {
          state: {
            ...state,
            status: 'error',
            message: 'Please enter a meal description.',
            food: null,
            foodSource: null,
          },
          command: { type: 'NONE' },
        };
      }

      return {
        state: {
          ...state,
          status: 'loading',
          mode: 'name',
          food: null,
          foodSource: null,
          message: null,
        },
        command: {
          type: 'ANALYZE_MEAL_TEXT',
          description,
        },
      };
    }

    case 'SEARCH_SUCCESS': {
      return {
        state: {
          ...state,
          status: 'success',
          food: event.food,
          foodSource: event.source,
          message: event.message ?? null,
        },
        command: { type: 'NONE' },
      };
    }

    case 'ADD_FOOD_TO_DAILY_LOG': {
      if (!state.food) {
        return {
          state: {
            ...state,
            status: 'error',
            message: 'Search or analyze a food before adding it.',
          },
          command: { type: 'NONE' },
        };
      }

      const loggedFoods = [
        {
          ...state.food,
          id: String(state.nextLoggedFoodId),
          source: state.foodSource ?? 'manual',
          loggedDate: event.loggedDate,
        },
      ];

      return {
        state: {
          ...state,
          nextLoggedFoodId: state.nextLoggedFoodId + 1,
          message: 'Saving food to daily summary...',
        },
        command: {
          type: 'SAVE_FOOD_TO_POCKETBASE',
          food: loggedFoods[0],
        },
      };
    }

    case 'SAVE_FOOD_SUCCESS': {
      const loggedFoods = [...state.loggedFoods, event.food];

      return {
        state: {
          ...state,
          loggedFoods,
          dailyTotals: calculateNutritionTotals(loggedFoods),
          status: 'idle',
          mode: 'idle',
          query: '',
          food: null,
          foodSource: null,
          message: 'Food saved to daily summary.',
        },
        command: { type: 'LOAD_WEEKLY_TOTALS_FROM_POCKETBASE' },
      };
    }

    case 'LOAD_SAVED_FOODS_START': {
      return {
        state: {
          ...state,
          message: 'Loading saved foods...',
        },
        command: { type: 'LOAD_SAVED_FOODS_FROM_POCKETBASE' },
      };
    }

    case 'LOAD_SAVED_FOODS_SUCCESS': {
      return {
        state: {
          ...state,
          loggedFoods: event.foods,
          dailyTotals: calculateNutritionTotals(event.foods),
          message: event.foods.length
            ? 'Saved foods loaded.'
            : 'No saved foods for today yet.',
        },
        command: { type: 'LOAD_WEEKLY_TOTALS_FROM_POCKETBASE' },
      };
    }

    case 'LOAD_WEEKLY_TOTALS_SUCCESS': {
      return {
        state: {
          ...state,
          weeklyTotals: event.totals,
        },
        command: { type: 'NONE' },
      };
    }

    case 'REMOVE_FOOD_FROM_DAILY_LOG': {
      const foodExists = state.loggedFoods.some((food) => food.id === event.id);
      if (!foodExists) {
        return {
          state: {
            ...state,
            status: 'error',
            message: 'Food was not found in the daily summary.',
          },
          command: { type: 'NONE' },
        };
      }

      return {
        state: {
          ...state,
          message: 'Removing food from daily summary...',
        },
        command: {
          type: 'DELETE_FOOD_FROM_POCKETBASE',
          id: event.id,
        },
      };
    }

    case 'DELETE_FOOD_SUCCESS': {
      const loggedFoods = state.loggedFoods.filter(
        (food) => food.id !== event.id
      );

      return {
        state: {
          ...state,
          loggedFoods,
          dailyTotals: calculateNutritionTotals(loggedFoods),
          message: 'Food removed from daily summary.',
        },
        command: { type: 'LOAD_WEEKLY_TOTALS_FROM_POCKETBASE' },
      };
    }

    case 'SEARCH_NOT_FOUND': {
      return {
        state: {
          ...state,
          status: 'not_found',
          food: null,
          foodSource: null,
          message: "Information about this food couldn't be found.",
        },
        command: { type: 'NONE' },
      };
    }

    case 'SEARCH_ERROR': {
      return {
        state: {
          ...state,
          status: 'error',
          food: null,
          foodSource: null,
          message: event.message ?? 'Something went wrong while searching.',
        },
        command: { type: 'NONE' },
      };
    }

    case 'RESET': {
      return {
        state: {
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
        },
        command: { type: 'NONE' },
      };
    }

    default:
      return { state, command: { type: 'NONE' } };
  }
}

export function createEmptyWeeklyTotals(): DailyNutritionTotal[] {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date: formatDateKey(date),
      label: formatDayLabel(date),
      totals: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      },
    };
  });
}

function calculateNutritionTotals(loggedFoods: LoggedFood[]): NutritionTotals {
  return loggedFoods.reduce<NutritionTotals>(
    (totals, food) => ({
      calories: roundNutritionValue(totals.calories + food.calories),
      protein: roundNutritionValue(totals.protein + food.protein),
      carbs: roundNutritionValue(totals.carbs + food.carbs),
      fats: roundNutritionValue(totals.fats + food.fats),
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    }
  );
}

function roundNutritionValue(value: number): number {
  return Math.round(value * 10) / 10;
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'short' });
}

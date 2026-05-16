import {
    FoodLoggingState,
    FoodLoggingEvent,
    FoodLoggingCommand,
    FoodLoggingResult,
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
            message: event.message ?? null,
          },
          command: { type: 'NONE' },
        };
      }
  
      case 'SEARCH_NOT_FOUND': {
        return {
          state: {
            ...state,
            status: 'not_found',
            food: null,
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
            message: null,
          },
          command: { type: 'NONE' },
        };
      }
  
      default:
        return { state, command: { type: 'NONE' } };
    }
  }

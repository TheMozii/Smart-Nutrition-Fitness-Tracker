export type Status =
  | 'idle'
  | 'editing'
  | 'loading'
  | 'success'
  | 'not_found'
  | 'error';

export type SearchMode = 'idle' | 'name' | 'barcode';

export type NutritionInfo = {
  name: string;
  barcode?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type LoggedFood = NutritionInfo & {
  id: string;
};

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type FoodLoggingState = {
  status: Status;
  mode: SearchMode;
  query: string;
  food: NutritionInfo | null;
  loggedFoods: LoggedFood[];
  dailyTotals: NutritionTotals;
  nextLoggedFoodId: number;
  message: string | null;
};

export type FoodLoggingEvent =
  | { type: 'TYPE_NAME'; value: string }
  | { type: 'SCAN_BARCODE'; value: string }
  | { type: 'SUBMIT_SEARCH' }
  | { type: 'SUBMIT_AI_ANALYSIS' }
  | { type: 'SEARCH_SUCCESS'; food: NutritionInfo; message?: string | null }
  | { type: 'ADD_FOOD_TO_DAILY_LOG' }
  | { type: 'REMOVE_FOOD_FROM_DAILY_LOG'; id: string }
  | { type: 'SEARCH_NOT_FOUND' }
  | { type: 'SEARCH_ERROR'; message?: string }
  | { type: 'RESET' };

export type FoodLoggingCommand =
  | { type: 'NONE' }
  | { type: 'FETCH_FOOD_BY_NAME'; name: string }
  | { type: 'FETCH_FOOD_BY_BARCODE'; barcode: string }
  | { type: 'ANALYZE_MEAL_TEXT'; description: string };

export type FoodLoggingResult = {
  state: FoodLoggingState;
  command: FoodLoggingCommand;
};

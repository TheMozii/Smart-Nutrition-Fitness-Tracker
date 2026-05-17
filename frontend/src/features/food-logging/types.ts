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
  source: FoodSource;
  loggedDate: string;
};

export type FoodSource = 'open_food_facts' | 'ai_text' | 'manual';

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
  foodSource: FoodSource | null;
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
  | {
      type: 'SEARCH_SUCCESS';
      food: NutritionInfo;
      source: FoodSource;
      message?: string | null;
    }
  | { type: 'ADD_FOOD_TO_DAILY_LOG'; loggedDate: string }
  | { type: 'SAVE_FOOD_SUCCESS'; food: LoggedFood }
  | { type: 'LOAD_SAVED_FOODS_START' }
  | { type: 'LOAD_SAVED_FOODS_SUCCESS'; foods: LoggedFood[] }
  | { type: 'REMOVE_FOOD_FROM_DAILY_LOG'; id: string }
  | { type: 'DELETE_FOOD_SUCCESS'; id: string }
  | { type: 'SEARCH_NOT_FOUND' }
  | { type: 'SEARCH_ERROR'; message?: string }
  | { type: 'RESET' };

export type FoodLoggingCommand =
  | { type: 'NONE' }
  | { type: 'FETCH_FOOD_BY_NAME'; name: string }
  | { type: 'FETCH_FOOD_BY_BARCODE'; barcode: string }
  | { type: 'ANALYZE_MEAL_TEXT'; description: string }
  | { type: 'SAVE_FOOD_TO_POCKETBASE'; food: LoggedFood }
  | { type: 'LOAD_SAVED_FOODS_FROM_POCKETBASE' }
  | { type: 'DELETE_FOOD_FROM_POCKETBASE'; id: string };

export type FoodLoggingResult = {
  state: FoodLoggingState;
  command: FoodLoggingCommand;
};

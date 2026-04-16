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

export type FoodLoggingState = {
  status: Status;
  mode: SearchMode;
  query: string;
  food: NutritionInfo | null;
  message: string | null;
};

export type FoodLoggingEvent =
  | { type: 'TYPE_NAME'; value: string }
  | { type: 'SCAN_BARCODE'; value: string }
  | { type: 'SUBMIT_SEARCH' }
  | { type: 'SEARCH_SUCCESS'; food: NutritionInfo }
  | { type: 'SEARCH_NOT_FOUND' }
  | { type: 'SEARCH_ERROR'; message?: string }
  | { type: 'RESET' };

export type FoodLoggingCommand =
  | { type: 'NONE' }
  | { type: 'FETCH_FOOD_BY_NAME'; name: string }
  | { type: 'FETCH_FOOD_BY_BARCODE'; barcode: string };

export type FoodLoggingResult = {
  state: FoodLoggingState;
  command: FoodLoggingCommand;
};
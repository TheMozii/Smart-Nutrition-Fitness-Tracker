import {
  analyzeFoodText,
  searchFoodByBarcode,
  searchFoodByName,
} from '../../services/api';
import {
  DailyNutritionTotal,
  FoodSource,
  LoggedFood,
  NutritionInfo,
  NutritionTotals,
} from './types';
import {
  DEMO_AUTH_TOKEN,
  DEMO_USER_ID,
  calculateDailyTotals,
  createDemoSavedFoods,
  createDemoWeeklyFoods,
  isDemoDataEnabled,
} from './demoData';

const DEFAULT_POCKETBASE_URL = 'http://127.0.0.1:8090';
const POCKETBASE_URL =
  process.env.EXPO_PUBLIC_POCKETBASE_URL ?? DEFAULT_POCKETBASE_URL;

export type FoodSearchResult =
  | {
      type: 'success';
      action: 'search_food';
      food: NutritionInfo;
      source: FoodSource;
      message?: string | null;
    }
  | { type: 'not_found'; message: string }
  | { type: 'error'; message: string };

export type SaveFoodResult =
  | { type: 'success'; action: 'save_food'; food: LoggedFood }
  | { type: 'error'; message: string };

export type LoadSavedFoodsResult =
  | { type: 'success'; action: 'load_saved_foods'; foods: LoggedFood[] }
  | { type: 'error'; message: string };

export type LoadWeeklyTotalsResult =
  | {
      type: 'success';
      action: 'load_weekly_totals';
      totals: DailyNutritionTotal[];
    }
  | { type: 'error'; message: string };

export type DeleteFoodResult =
  | { type: 'success'; action: 'delete_food'; id: string }
  | { type: 'error'; message: string };

export async function fetchFoodByName(name: string): Promise<FoodSearchResult> {
  try {
    const response = await searchFoodByName(name);

    if (response.status === 'success' && response.food) {
      return {
        type: 'success',
        action: 'search_food',
        food: response.food,
        source: 'open_food_facts',
        message: response.message,
      };
    }

    return {
      type: 'not_found',
      message: response.message ?? "Information about this food couldn't be found.",
    };
  } catch (error) {
    if (isNetworkError(error)) {
      return {
        type: 'error',
        message: 'PocketBase is unavailable. Start the local database and try again.',
      };
    }

    return {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong while searching.',
    };
  }
}

export async function fetchFoodByBarcode(
  barcode: string
): Promise<FoodSearchResult> {
  try {
    const response = await searchFoodByBarcode(barcode);

    if (response.status === 'success' && response.food) {
      return {
        type: 'success',
        action: 'search_food',
        food: response.food,
        source: 'open_food_facts',
        message: response.message,
      };
    }

    return {
      type: 'not_found',
      message: response.message ?? "Information about this food couldn't be found.",
    };
  } catch (error) {
    if (isNetworkError(error)) {
      return {
        type: 'error',
        message: 'PocketBase is unavailable. Start the local database and try again.',
      };
    }

    return {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong while searching.',
    };
  }
}

export async function analyzeMealText(
  description: string
): Promise<FoodSearchResult> {
  try {
    const response = await analyzeFoodText(description);

    if (response.status === 'success' && response.food) {
      return {
        type: 'success',
        action: 'search_food',
        food: response.food,
        source: 'ai_text',
        message: response.message,
      };
    }

    return {
      type: 'not_found',
      message: response.message ?? "Information about this food couldn't be found.",
    };
  } catch (error) {
    if (isNetworkError(error)) {
      return {
        type: 'error',
        message: 'PocketBase is unavailable. Start the local database and try again.',
      };
    }

    return {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong while analyzing the meal.',
    };
  }
}

export async function saveFoodToPocketBase(
  food: LoggedFood,
  authToken: string,
  userId: string
): Promise<SaveFoodResult> {
  if (isDemoSession(authToken, userId)) {
    demoSavedFoods = [...demoSavedFoods, food];
    demoWeeklyFoods = [...demoWeeklyFoods, food];

    return {
      type: 'success',
      action: 'save_food',
      food,
    };
  }

  try {
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/nutritions/records`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userId,
          name: food.name,
          source: food.source,
          barcode: food.barcode ?? '',
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fats: food.fats,
          loggedDate: food.loggedDate,
        }),
      }
    );

    if (!response.ok) {
      return {
        type: 'error',
        message: await readPocketBaseError(response),
      };
    }

    const record = await response.json();

    return {
      type: 'success',
      action: 'save_food',
      food: {
        ...food,
        id: typeof record.id === 'string' ? record.id : food.id,
      },
    };
  } catch (error) {
    if (isNetworkError(error)) {
      return {
        type: 'error',
        message: 'PocketBase is unavailable. Start the local database and try again.',
      };
    }

    return {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Could not save food to PocketBase.',
    };
  }
}

export async function loadSavedFoodsFromPocketBase(
  authToken: string,
  userId: string
): Promise<LoadSavedFoodsResult> {
  if (isDemoSession(authToken, userId)) {
    ensureDemoFoodsLoaded();

    return {
      type: 'success',
      action: 'load_saved_foods',
      foods: [...demoSavedFoods],
    };
  }

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const filter = encodeURIComponent(
      `user = "${userId}" && loggedDate >= "${startOfDay.toISOString()}" && loggedDate < "${endOfDay.toISOString()}"`
    );

    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/nutritions/records?filter=${filter}&sort=loggedDate`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      return {
        type: 'error',
        message: await readPocketBaseError(response),
      };
    }

    const data = await response.json();

    return {
      type: 'success',
      action: 'load_saved_foods',
      foods: mapPocketBaseNutritionRecords(data),
    };
  } catch (error) {
    return {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Could not load saved foods from PocketBase.',
    };
  }
}

export async function loadWeeklyTotalsFromPocketBase(
  authToken: string,
  userId: string
): Promise<LoadWeeklyTotalsResult> {
  if (isDemoSession(authToken, userId)) {
    ensureDemoFoodsLoaded();

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    return {
      type: 'success',
      action: 'load_weekly_totals',
      totals: calculateDailyTotals(demoWeeklyFoods, startDate),
    };
  }

  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 6);

    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() + 1);

    const filter = encodeURIComponent(
      `user = "${userId}" && loggedDate >= "${startDate.toISOString()}" && loggedDate < "${endDate.toISOString()}"`
    );

    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/nutritions/records?filter=${filter}&sort=loggedDate&perPage=200`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      return {
        type: 'error',
        message: await readPocketBaseError(response),
      };
    }

    const data = await response.json();
    const foods = mapPocketBaseNutritionRecords(data);

    return {
      type: 'success',
      action: 'load_weekly_totals',
      totals: calculateWeeklyTotals(foods, startDate),
    };
  } catch (error) {
    return {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Could not load weekly nutrition totals from PocketBase.',
    };
  }
}

export async function deleteFoodFromPocketBase(
  id: string,
  authToken: string
): Promise<DeleteFoodResult> {
  if (isDemoSession(authToken)) {
    demoSavedFoods = demoSavedFoods.filter((food) => food.id !== id);
    demoWeeklyFoods = demoWeeklyFoods.filter((food) => food.id !== id);

    return {
      type: 'success',
      action: 'delete_food',
      id,
    };
  }

  try {
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/nutritions/records/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      return {
        type: 'error',
        message: await readPocketBaseError(response),
      };
    }

    return {
      type: 'success',
      action: 'delete_food',
      id,
    };
  } catch (error) {
    return {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Could not delete food from PocketBase.',
    };
  }
}

async function readPocketBaseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    const fieldError = readPocketBaseFieldError(data);
    if (fieldError) {
      return fieldError;
    }

    if (typeof data.message === 'string' && data.message) {
      return data.message;
    }
  } catch {
    return 'Could not save food to PocketBase.';
  }

  return 'Could not save food to PocketBase.';
}

function readPocketBaseFieldError(data: unknown): string | null {
  if (!isRecord(data) || !isRecord(data.data)) {
    return null;
  }

  for (const [field, value] of Object.entries(data.data)) {
    if (!isRecord(value)) {
      continue;
    }

    const message = value.message;
    if (typeof message === 'string' && message) {
      return `${field}: ${message}`;
    }
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

function mapPocketBaseNutritionRecords(data: unknown): LoggedFood[] {
  if (!isRecord(data) || !Array.isArray(data.items)) {
    return [];
  }

  return data.items.filter(isRecord).map((record) => ({
    id: readString(record.id),
    name: readString(record.name) || 'Saved food',
    source: readFoodSource(record.source),
    barcode: readString(record.barcode) || undefined,
    calories: readNumber(record.calories),
    protein: readNumber(record.protein),
    carbs: readNumber(record.carbs),
    fats: readNumber(record.fats),
    loggedDate: readString(record.loggedDate),
  }));
}

function calculateWeeklyTotals(
  foods: LoggedFood[],
  startDate: Date
): DailyNutritionTotal[] {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      date: formatDateKey(date),
      label: formatDayLabel(date),
      totals: createEmptyNutritionTotals(),
    };
  });

  const totalsByDate = new Map(days.map((day) => [day.date, day.totals]));

  for (const food of foods) {
    const date = new Date(food.loggedDate);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const totals = totalsByDate.get(formatDateKey(date));
    if (!totals) {
      continue;
    }

    totals.calories = roundNutritionValue(totals.calories + food.calories);
    totals.protein = roundNutritionValue(totals.protein + food.protein);
    totals.carbs = roundNutritionValue(totals.carbs + food.carbs);
    totals.fats = roundNutritionValue(totals.fats + food.fats);
  }

  return days;
}

function createEmptyNutritionTotals(): NutritionTotals {
  return {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  };
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

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function readNumber(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}

function readFoodSource(value: unknown): FoodSource {
  if (
    value === 'open_food_facts' ||
    value === 'ai_text' ||
    value === 'manual'
  ) {
    return value;
  }

  return 'manual';
}

function isDemoSession(authToken?: string, userId?: string): boolean {
  return (
    isDemoDataEnabled() ||
    authToken === DEMO_AUTH_TOKEN ||
    userId === DEMO_USER_ID
  );
}

let demoSavedFoods: LoggedFood[] = [];
let demoWeeklyFoods: LoggedFood[] = [];

function ensureDemoFoodsLoaded(): void {
  if (demoSavedFoods.length === 0) {
    demoSavedFoods = createDemoSavedFoods();
  }

  if (demoWeeklyFoods.length === 0) {
    const todayDateKey = new Date().toISOString().slice(0, 10);
    const weeklyHistory = createDemoWeeklyFoods().filter(
      (food) => food.loggedDate.slice(0, 10) !== todayDateKey
    );
    demoWeeklyFoods = [...weeklyHistory, ...demoSavedFoods];
  }
}

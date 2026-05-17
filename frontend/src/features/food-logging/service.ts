import {
  analyzeFoodText,
  searchFoodByBarcode,
  searchFoodByName,
} from '../../services/api';
import { FoodSource, LoggedFood, NutritionInfo } from './types';

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
    return {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Could not save food to PocketBase.',
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

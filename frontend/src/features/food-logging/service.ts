import {
  analyzeFoodText,
  searchFoodByBarcode,
  searchFoodByName,
} from '../../services/api';
import { NutritionInfo } from './types';

export type FoodSearchResult =
  | { type: 'success'; food: NutritionInfo; message?: string | null }
  | { type: 'not_found'; message: string }
  | { type: 'error'; message: string };

export async function fetchFoodByName(name: string): Promise<FoodSearchResult> {
  try {
    const response = await searchFoodByName(name);

    if (response.status === 'success' && response.food) {
      return { type: 'success', food: response.food, message: response.message };
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
      return { type: 'success', food: response.food, message: response.message };
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
      return { type: 'success', food: response.food, message: response.message };
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

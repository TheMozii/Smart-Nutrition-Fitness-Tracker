import {
  searchFoodByBarcode,
  searchFoodByName,
} from '../../services/api';
import { NutritionInfo } from './types';

export type FoodSearchResult =
  | { type: 'success'; food: NutritionInfo }
  | { type: 'not_found'; message: string }
  | { type: 'error'; message: string };

export async function fetchFoodByName(name: string): Promise<FoodSearchResult> {
  try {
    const response = await searchFoodByName(name);

    if (response.status === 'success' && response.food) {
      return { type: 'success', food: response.food };
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
      return { type: 'success', food: response.food };
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

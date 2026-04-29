import { Platform } from 'react-native';

const DEFAULT_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;

export async function getHealth() {
  const response = await fetch(`${BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return response.json();
}

export type FoodApiResponse = {
  status: 'success' | 'not_found' | 'error';
  food: {
    name: string;
    barcode?: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  } | null;
  message: string | null;
};

async function readFoodResponse(response: Response): Promise<FoodApiResponse> {
  const data = await response.json();

  if (response.ok) {
    return data;
  }

  if (response.status === 404) {
    return {
      status: 'not_found',
      food: null,
      message: data.detail ?? "Information about this food couldn't be found.",
    };
  }

  throw new Error(data.detail ?? `Backend returned ${response.status}`);
}

export async function searchFoodByName(name: string): Promise<FoodApiResponse> {
  const response = await fetch(
    `${BASE_URL}/food/search?name=${encodeURIComponent(name)}`
  );

  return readFoodResponse(response);
}

export async function searchFoodByBarcode(
  barcode: string
): Promise<FoodApiResponse> {
  const response = await fetch(
    `${BASE_URL}/food/barcode/${encodeURIComponent(barcode)}`
  );

  return readFoodResponse(response);
}

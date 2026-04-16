import { NutritionInfo } from './types';

export function buildMacroChartData(food: NutritionInfo) {
  return [
    { x: 'Protein', y: food.protein },
    { x: 'Carbs', y: food.carbs },
    { x: 'Fats', y: food.fats },
  ];
}
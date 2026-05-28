import {
  DailyNutritionTotal,
  LoggedFood,
  NutritionTotals,
} from './types';

export const DEMO_USER_ID = 'demo-user';
export const DEMO_AUTH_TOKEN = 'demo-token';
export const DEMO_USER_EMAIL = 'demo@example.com';

const demoFoodTemplates = [
  {
    name: 'Greek yogurt with berries',
    source: 'manual' as const,
    calories: 310,
    protein: 24,
    carbs: 36,
    fats: 7,
  },
  {
    name: 'Chicken rice bowl',
    source: 'manual' as const,
    calories: 640,
    protein: 48,
    carbs: 72,
    fats: 16,
  },
  {
    name: 'Protein smoothie',
    source: 'ai_text' as const,
    calories: 420,
    protein: 34,
    carbs: 45,
    fats: 11,
  },
  {
    name: 'Salmon salad',
    source: 'manual' as const,
    calories: 520,
    protein: 39,
    carbs: 22,
    fats: 30,
  },
  {
    name: 'Oatmeal with banana',
    source: 'manual' as const,
    calories: 390,
    protein: 14,
    carbs: 68,
    fats: 8,
  },
  {
    name: 'Turkey sandwich',
    source: 'manual' as const,
    calories: 470,
    protein: 31,
    carbs: 52,
    fats: 14,
  },
  {
    name: 'Eggs and toast',
    source: 'ai_text' as const,
    calories: 430,
    protein: 25,
    carbs: 35,
    fats: 21,
  },
];

export function isDemoDataEnabled(): boolean {
  return process.env.EXPO_PUBLIC_USE_DEMO_DATA === 'true';
}

export function createDemoSavedFoods(today = new Date()): LoggedFood[] {
  const startOfDay = new Date(today);
  startOfDay.setHours(8, 0, 0, 0);

  return demoFoodTemplates.slice(0, 3).map((food, index) => {
    const loggedDate = new Date(startOfDay);
    loggedDate.setHours(startOfDay.getHours() + index * 4);

    return {
      ...food,
      id: `demo-today-${index + 1}`,
      loggedDate: loggedDate.toISOString(),
    };
  });
}

export function createDemoWeeklyFoods(today = new Date()): LoggedFood[] {
  const foods: LoggedFood[] = [];

  for (let dayOffset = 6; dayOffset >= 0; dayOffset -= 1) {
    const date = new Date(today);
    date.setHours(12, 0, 0, 0);
    date.setDate(today.getDate() - dayOffset);

    const foodCount = dayOffset === 0 ? 3 : 2;
    for (let foodIndex = 0; foodIndex < foodCount; foodIndex += 1) {
      const template =
        demoFoodTemplates[(dayOffset + foodIndex) % demoFoodTemplates.length];

      foods.push({
        ...template,
        id: `demo-week-${dayOffset}-${foodIndex}`,
        calories: template.calories + (6 - dayOffset) * 25,
        loggedDate: date.toISOString(),
      });
    }
  }

  return foods;
}

export function calculateDailyTotals(
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

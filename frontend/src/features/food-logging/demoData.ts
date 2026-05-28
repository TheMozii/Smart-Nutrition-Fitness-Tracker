import {
  DailyNutritionTotal,
  LoggedFood,
  NutritionInfo,
  NutritionTotals,
} from './types';

export const DEMO_USER_ID = 'demo-user';
export const DEMO_AUTH_TOKEN = 'demo-token';

type LocalStorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem?: (key: string) => void;
};

export type DemoAuthUser = {
  id: string;
  email: string;
  password: string;
};

const DEMO_USERS_STORAGE_KEY = 'smartNutrition.demo.users';
const DEMO_SESSION_STORAGE_KEY = 'smartNutrition.demo.session';
const DEMO_FOODS_STORAGE_PREFIX = 'smartNutrition.demo.foods.';
const DEMO_WEEKLY_FOODS_STORAGE_PREFIX = 'smartNutrition.demo.weeklyFoods.';

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

const demoFoodLookup: NutritionInfo[] = [
  {
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fats: 0.3,
  },
  {
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fats: 0.4,
  },
  {
    name: 'Egg',
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fats: 5.3,
  },
  {
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
  },
  {
    name: 'Cooked White Rice',
    calories: 205,
    protein: 4.3,
    carbs: 45,
    fats: 0.4,
  },
  {
    name: 'Greek Yogurt',
    calories: 150,
    protein: 15,
    carbs: 8,
    fats: 5,
  },
  {
    name: 'Salmon',
    calories: 208,
    protein: 20,
    carbs: 0,
    fats: 13,
  },
  {
    name: 'Oatmeal',
    calories: 154,
    protein: 6,
    carbs: 27,
    fats: 3,
  },
  {
    name: 'Whole Wheat Bread',
    calories: 80,
    protein: 4,
    carbs: 14,
    fats: 1,
  },
  {
    name: 'Milk',
    calories: 122,
    protein: 8,
    carbs: 12,
    fats: 4.8,
  },
];

export function isDemoDataEnabled(): boolean {
  return process.env.EXPO_PUBLIC_USE_DEMO_DATA === 'true' || isBrowserRuntime();
}

export function registerDemoUser(
  email: string,
  password: string
): DemoAuthUser {
  const users = readDemoUsers();
  const normalizedEmail = normalizeEmail(email);
  const existingUser = users.find((user) => user.email === normalizedEmail);
  const user = {
    id: existingUser?.id ?? createDemoUserId(normalizedEmail),
    email: normalizedEmail,
    password,
  };

  writeDemoUsers([
    ...users.filter((savedUser) => savedUser.email !== normalizedEmail),
    user,
  ]);

  if (!hasStoredDemoFoodData(user.id)) {
    seedStoredDemoFoods(user.id);
  }

  return user;
}

export function signInDemoUser(
  email: string,
  password: string
): DemoAuthUser | null {
  const normalizedEmail = normalizeEmail(email);
  const user = readDemoUsers().find(
    (savedUser) =>
      savedUser.email === normalizedEmail && savedUser.password === password
  );

  if (!user) {
    return null;
  }

  if (!hasStoredDemoFoodData(user.id)) {
    seedStoredDemoFoods(user.id);
  }

  return user;
}

export function findDemoFoodByName(query: string): NutritionInfo | null {
  const normalizedQuery = normalizeFoodSearchText(query);
  if (!normalizedQuery) {
    return null;
  }

  return (
    demoFoodLookup.find(
      (food) => normalizeFoodSearchText(food.name) === normalizedQuery
    ) ??
    demoFoodLookup.find((food) =>
      normalizeFoodSearchText(food.name).includes(normalizedQuery)
    ) ??
    demoFoodLookup.find((food) =>
      normalizedQuery.includes(normalizeFoodSearchText(food.name))
    ) ??
    null
  );
}

export function readStoredDemoSession(): DemoAuthUser | null {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  try {
    const data = JSON.parse(storage.getItem(DEMO_SESSION_STORAGE_KEY) ?? 'null');
    return isDemoAuthUser(data) ? data : null;
  } catch {
    return null;
  }
}

export function writeStoredDemoSession(user: DemoAuthUser): void {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  storage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredDemoSession(): void {
  const storage = getLocalStorage();
  if (!storage || !storage.removeItem) {
    return;
  }

  storage.removeItem(DEMO_SESSION_STORAGE_KEY);
}

export function readStoredDemoFoods(userId = DEMO_USER_ID): LoggedFood[] {
  const storage = getLocalStorage();
  if (!storage) {
    return createDemoSavedFoods();
  }

  const key = `${DEMO_FOODS_STORAGE_PREFIX}${userId}`;
  if (storage.getItem(key) !== null) {
    return readStoredFoodList(storage, key);
  }

  return seedStoredDemoFoods(userId).savedFoods;
}

export function writeStoredDemoFoods(
  userId: string,
  foods: LoggedFood[]
): void {
  writeStoredFoodList(`${DEMO_FOODS_STORAGE_PREFIX}${userId}`, foods);
}

export function readStoredDemoWeeklyFoods(userId = DEMO_USER_ID): LoggedFood[] {
  const storage = getLocalStorage();
  if (!storage) {
    return createDemoWeeklyFoods();
  }

  const key = `${DEMO_WEEKLY_FOODS_STORAGE_PREFIX}${userId}`;
  if (storage.getItem(key) !== null) {
    return readStoredFoodList(storage, key);
  }

  return seedStoredDemoFoods(userId).weeklyFoods;
}

export function writeStoredDemoWeeklyFoods(
  userId: string,
  foods: LoggedFood[]
): void {
  writeStoredFoodList(`${DEMO_WEEKLY_FOODS_STORAGE_PREFIX}${userId}`, foods);
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

function seedStoredDemoFoods(userId: string): {
  savedFoods: LoggedFood[];
  weeklyFoods: LoggedFood[];
} {
  const savedFoods = createDemoSavedFoods();
  const todayDateKey = new Date().toISOString().slice(0, 10);
  const weeklyHistory = createDemoWeeklyFoods().filter(
    (food) => food.loggedDate.slice(0, 10) !== todayDateKey
  );
  const weeklyFoods = [...weeklyHistory, ...savedFoods];

  writeStoredDemoFoods(userId, savedFoods);
  writeStoredDemoWeeklyFoods(userId, weeklyFoods);

  return {
    savedFoods,
    weeklyFoods,
  };
}

function hasStoredDemoFoodData(userId: string): boolean {
  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  return storage.getItem(`${DEMO_FOODS_STORAGE_PREFIX}${userId}`) !== null;
}

function readDemoUsers(): DemoAuthUser[] {
  const storage = getLocalStorage();
  if (!storage) {
    return [];
  }

  try {
    const data = JSON.parse(storage.getItem(DEMO_USERS_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(isDemoAuthUser);
  } catch {
    return [];
  }
}

function writeDemoUsers(users: DemoAuthUser[]): void {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  storage.setItem(DEMO_USERS_STORAGE_KEY, JSON.stringify(users));
}

function readStoredFoodList(
  storage: LocalStorageLike,
  key: string
): LoggedFood[] {
  try {
    const data = JSON.parse(storage.getItem(key) ?? '[]');
    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(isLoggedFood);
  } catch {
    return [];
  }
}

function writeStoredFoodList(key: string, foods: LoggedFood[]): void {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  storage.setItem(key, JSON.stringify(foods));
}

function createDemoUserId(email: string): string {
  return `demo-${email.replace(/[^a-z0-9]/g, '-')}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeFoodSearchText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function isDemoAuthUser(value: unknown): value is DemoAuthUser {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.password === 'string'
  );
}

function isLoggedFood(value: unknown): value is LoggedFood {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.source === 'string' &&
    typeof value.calories === 'number' &&
    typeof value.protein === 'number' &&
    typeof value.carbs === 'number' &&
    typeof value.fats === 'number' &&
    typeof value.loggedDate === 'string'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getLocalStorage(): LocalStorageLike | null {
  const storage = (
    globalThis as typeof globalThis & {
      localStorage?: LocalStorageLike;
    }
  ).localStorage;

  return storage ?? null;
}

function isBrowserRuntime(): boolean {
  return typeof document !== 'undefined';
}

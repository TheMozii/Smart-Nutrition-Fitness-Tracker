import { AuthMode, AuthUser } from './types';
import {
  DEMO_AUTH_TOKEN,
  registerDemoUser,
  isDemoDataEnabled,
  signInDemoUser,
  writeStoredDemoSession,
} from '../food-logging/demoData';

const DEFAULT_POCKETBASE_URL = 'http://127.0.0.1:8090';
const POCKETBASE_URL =
  process.env.EXPO_PUBLIC_POCKETBASE_URL ?? DEFAULT_POCKETBASE_URL;

type PocketBaseAuthResponse = {
  token: string;
  record: {
    id: string;
    email: string;
    username?: string;
  };
};

export type AuthResult =
  | { type: 'success'; user: AuthUser; token: string; message: string }
  | { type: 'error'; message: string };

export async function authenticateWithPocketBase(
  mode: AuthMode,
  email: string,
  password: string
): Promise<AuthResult> {
  if (isDemoDataEnabled()) {
    const demoUser =
      mode === 'register'
        ? registerDemoUser(email, password)
        : signInDemoUser(email, password);

    if (!demoUser) {
      return {
        type: 'error',
        message: 'Demo user not found. Register first, then sign in.',
      };
    }

    writeStoredDemoSession(demoUser);

    return {
      type: 'success',
      user: {
        id: demoUser.id,
        email: demoUser.email,
      },
      token: DEMO_AUTH_TOKEN,
      message:
        mode === 'register'
          ? 'Demo account saved in this browser.'
          : 'Signed in with saved demo account.',
    };
  }

  try {
    if (mode === 'register') {
      await createPocketBaseUser(email, password);
    }

    const authData = await signInPocketBaseUser(email, password);

    return {
      type: 'success',
      user: {
        id: authData.record.id,
        email: authData.record.email,
      },
      token: authData.token,
      message: mode === 'register' ? 'Account created.' : 'Signed in.',
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
          : 'Authentication failed. Check your PocketBase setup.',
    };
  }
}

async function createPocketBaseUser(
  email: string,
  password: string
): Promise<void> {
  const response = await fetch(`${POCKETBASE_URL}/api/collections/users/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      username: buildUsernameFromEmail(email),
      password,
      passwordConfirm: password,
    }),
  });

  if (!response.ok) {
    throw new Error(await readPocketBaseError(response));
  }
}

async function signInPocketBaseUser(
  email: string,
  password: string
): Promise<PocketBaseAuthResponse> {
  const response = await fetch(
    `${POCKETBASE_URL}/api/collections/users/auth-with-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: email,
        password,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await readPocketBaseError(response));
  }

  return response.json();
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
    return 'Authentication failed. Check your PocketBase setup.';
  }

  return 'Authentication failed. Check your PocketBase setup.';
}

function readPocketBaseFieldError(data: unknown): string | null {
  if (!isRecord(data)) {
    return null;
  }

  const fieldErrors = data.data;
  if (!isRecord(fieldErrors)) {
    return null;
  }

  for (const [field, value] of Object.entries(fieldErrors)) {
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

function buildUsernameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError;
}

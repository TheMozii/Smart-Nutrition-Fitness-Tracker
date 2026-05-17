export type AuthMode = 'login' | 'register';

export type AuthStatus = 'editing' | 'loading' | 'authenticated' | 'error';

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthState = {
  mode: AuthMode;
  status: AuthStatus;
  email: string;
  password: string;
  user: AuthUser | null;
  token: string | null;
  message: string | null;
};

export type AuthEvent =
  | { type: 'TYPE_EMAIL'; value: string }
  | { type: 'TYPE_PASSWORD'; value: string }
  | { type: 'TOGGLE_MODE' }
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; user: AuthUser; token: string; message: string }
  | { type: 'AUTH_ERROR'; message: string }
  | { type: 'SIGN_OUT' };

import { useReducer } from 'react';
import { authReducer } from './reducer';
import { AuthEvent, AuthState } from './types';
import { authenticateWithPocketBase } from './service';
import {
  clearStoredDemoSession,
  DEMO_AUTH_TOKEN,
  isDemoDataEnabled,
  readStoredDemoSession,
} from '../food-logging/demoData';

function createInitialState(): AuthState {
  const storedDemoUser = isDemoDataEnabled() ? readStoredDemoSession() : null;

  if (storedDemoUser) {
    return {
      mode: 'login',
      status: 'authenticated',
      email: storedDemoUser.email,
      password: '',
      user: {
        id: storedDemoUser.id,
        email: storedDemoUser.email,
      },
      token: DEMO_AUTH_TOKEN,
      message: 'Signed in with saved demo session.',
    };
  }

  return {
    mode: 'login',
    status: 'editing',
    email: '',
    password: '',
    user: null,
    token: null,
    message: null,
  };
}

export function useAuth() {
  const [state, dispatchBase] = useReducer(
    authReducer,
    undefined,
    createInitialState
  );

  function dispatch(event: AuthEvent) {
    if (event.type === 'SIGN_OUT') {
      clearStoredDemoSession();
    }

    dispatchBase(event);
  }

  async function submitAuth() {
    const validationMessage = validateAuthInput(state.email, state.password);
    if (validationMessage) {
      dispatch({ type: 'AUTH_ERROR', message: validationMessage });
      return;
    }

    dispatch({ type: 'AUTH_START' });

    const result = await authenticateWithPocketBase(
      state.mode,
      state.email,
      state.password
    );

    if (result.type === 'success') {
      dispatch({
        type: 'AUTH_SUCCESS',
        user: result.user,
        token: result.token,
        message: result.message,
      });
      return;
    }

    dispatch({ type: 'AUTH_ERROR', message: result.message });
  }

  return {
    state,
    dispatch,
    submitAuth,
  };
}

function validateAuthInput(email: string, password: string): string | null {
  if (!email) {
    return 'Please enter your email.';
  }

  if (!email.includes('@')) {
    return 'Please enter a valid email address.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return null;
}

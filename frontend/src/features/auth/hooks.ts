import { useReducer } from 'react';
import { authReducer } from './reducer';
import { AuthState } from './types';
import { authenticateWithPocketBase } from './service';
import {
  DEMO_AUTH_TOKEN,
  DEMO_USER_EMAIL,
  DEMO_USER_ID,
} from '../food-logging/demoData';

const initialState: AuthState = {
  mode: 'login',
  status: 'editing',
  email: '',
  password: '',
  user: null,
  token: null,
  message: null,
};

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);

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

  function continueWithDemoData() {
    dispatch({
      type: 'AUTH_SUCCESS',
      user: {
        id: DEMO_USER_ID,
        email: state.email || DEMO_USER_EMAIL,
      },
      token: DEMO_AUTH_TOKEN,
      message: 'Signed in with demo data.',
    });
  }

  return {
    state,
    dispatch,
    submitAuth,
    continueWithDemoData,
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

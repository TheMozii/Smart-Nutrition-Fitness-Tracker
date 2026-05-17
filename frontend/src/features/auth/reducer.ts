import { AuthEvent, AuthState } from './types';

export function authReducer(state: AuthState, event: AuthEvent): AuthState {
  switch (event.type) {
    case 'TYPE_EMAIL':
      return {
        ...state,
        email: event.value.trim(),
        status: 'editing',
        message: null,
      };

    case 'TYPE_PASSWORD':
      return {
        ...state,
        password: event.value,
        status: 'editing',
        message: null,
      };

    case 'TOGGLE_MODE':
      return {
        ...state,
        mode: state.mode === 'login' ? 'register' : 'login',
        status: 'editing',
        message: null,
      };

    case 'AUTH_START':
      return {
        ...state,
        status: 'loading',
        message: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        status: 'authenticated',
        user: event.user,
        token: event.token,
        password: '',
        message: event.message,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        status: 'error',
        user: null,
        token: null,
        message: event.message,
      };

    case 'SIGN_OUT':
      return {
        ...state,
        status: 'editing',
        password: '',
        user: null,
        token: null,
        message: null,
      };

    default:
      return state;
  }
}

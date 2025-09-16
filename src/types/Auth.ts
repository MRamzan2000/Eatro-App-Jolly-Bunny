export interface User {
  id: string;
  name: string;
  email: string;
  provider: 'google' | 'email' | 'guest';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
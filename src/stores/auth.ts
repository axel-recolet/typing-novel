import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string
  exp: number;
}

interface AuthState {
  token: string | null;
  payload: JwtPayload | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    payload: null,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.token && !this.isTokenExpired;
    },
    isTokenExpired(): boolean {
      if (!this.payload) return true;
      const currentTime = Math.floor(Date.now() / 1000);
      return this.payload.exp < currentTime;
    },
  },

  actions: {
    setToken(token: string) {
      this.token = token;
      this.decodeToken();
    },

    decodeToken() {
      if (this.token) {
        try {
          this.payload = jwtDecode<JwtPayload>(this.token);
          console.log('payload jwt :', this.payload)
          // this.payload.darkMode = this.payload.darkMode ?? window.matchMedia('(prefers-color-scheme: dark)').matches
        } catch (error) {
          console.error('Invalid token', error);
          this.logout();
        }
      }
    },

    logout() {
      this.token = null;
      this.payload = null;
      localStorage.removeItem('authToken');
    },

    storageToken(token: string) {
      localStorage.setItem('authToken', token);
      this.setToken(token)
    },

    loadTokenFromStorage() {
      const token = localStorage.getItem('authToken');
      console.log('token from localStorage: ', token)
      if (token) {
        this.setToken(token);
      }
    },
  },
});

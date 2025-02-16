import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

type User = {
  username: string,
  preferences?: {
    fontSize?: number
  }
}

type UserState = {
  user: User | undefined
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: undefined
  }),
  actions: {
    async fetchUserData() {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        try {
          const response = await fetch(`/api/users/${authStore.payload?.id}`, {
            headers: {
              'Authorization': `Bearer ${authStore.token}`,
            },
          })
          if (response.ok) {
            this.user = await response.json()
          } else {
            throw new Error('Failed to fetch user data')
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    increaseFontSize(initialFontSize: number) {
      if (!this.user) return
      else if (this.user.preferences === undefined) {
        this.user.preferences = {}
      }

      if (this.user.preferences.fontSize === undefined) {
        this.user.preferences.fontSize = initialFontSize + 2
      } else {
        this.user.preferences.fontSize += 2
      }
    }
  },
});

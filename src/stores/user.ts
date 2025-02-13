import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'

type User = {
  username: string;
  inProgressNovels: {
    novelId: string;
    part: number;
    cursor: number;
  }
}

export const useUserStore = defineStore('user', () => {
  const user: Ref<User | undefined> = ref(undefined)
  const isDarkMode: Ref<boolean> = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
  }
  return { user, isDarkMode, toggleDarkMode }
})

<template>
  <div :class="{ dark: user.isDarkMode }">
    <header class="fixed top-0 left-0 w-full z-50 dark:bg-black dark:text-white shadow-md p-6">
      <nav class="container mx-auto flex justify-between items-center gap-5">
        <div class="flex [gap:inherit]">
          <router-link to="/">Home</router-link>
          <router-link to="/novels">Novels</router-link>
        </div>
        <div class="flex [gap:inherit]">
          <button
            @click="() => user.toggleDarkMode()"
            class="relative inline-flex items-center h-6 w-12 rounded-full transition-colors bg-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span
              class="inline-block h-5 w-5 transform bg-white rounded-full transition-transform"
              :class="{ 'translate-x-6': user.isDarkMode, 'translate-x-0': !user.isDarkMode }"
            ></span>
          </button>
          <router-link to="/login">login</router-link>
        </div>
      </nav>
    </header>
    <main class="pt-14">
      <div class="pt-5">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));
</style>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const user = useAuthStore()
</script>

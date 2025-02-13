<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startTyping = () => {
  router.push('/training')
}
</script>

<template>
  <main>
    <div class="min-h-screen flex flex-col items-center justify-center p-6">
      <div class="bg-white shadow-lg rounded-2xl p-8 max-w-2xl text-center">
        <h1 class="text-2xl font-semibold text-gray-800 mb-4">
          Améliorez votre dactylographie en tapant des romans !
        </h1>
        <p class="text-gray-600 mb-6">
          Plongez-vous dans des histoires captivantes tout en perfectionnant votre vitesse et
          précision de frappe.
        </p>
        <button
          @click="startTyping"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300"
        >
          Commencer l'entraînement
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped></style>

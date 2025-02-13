<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 bg-black rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center text-gray-800">Connexion</h2>
      <form @submit.prevent="handleLogin" class="space-y-4 flex flex-col gap-4">
        <div class="inputs">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Adresse e-mail</label
            >
            <input
              type="email"
              id="email"
              v-model="email"
              class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre adresse e-mail"
              required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"
              >Mot de passe</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Se connecter
        </button>
      </form>
      <p class="text-sm text-center text-gray-600">
        Pas encore de compte ?
        <a href="/signup" class="text-blue-500 hover:underline">Inscrivez-vous</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Variables réactives pour le formulaire
const email = ref('')
const password = ref('')

// Fonction pour hacher les données en SHA-256
const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Fonction de soumission du formulaire
const handleLogin = async () => {
  const hashedEmail = await hashData(email.value)
  const hashedPassword = await hashData(password.value)

  console.log('Email (hash):', hashedEmail)
  console.log('Password (hash):', hashedPassword)

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: hashedEmail,
        password: hashedPassword,
      }),
    })

    if (response.ok) {
      console.log('Connexion réussie')
    } else {
      console.error('Erreur de connexion')
    }
  } catch (error) {
    console.error('Erreur réseau :', error)
  }
}
</script>

<style scoped>
/* Ajoutez des styles personnalisés si nécessaire */
</style>

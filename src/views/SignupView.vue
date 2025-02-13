<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center">Inscription</h2>
      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium">Adresse e-mail</label>
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
          <label for="pseudo" class="block text-sm font-medium">Pseudo</label>
          <input
            type="text"
            id="pseudo"
            v-model="pseudo"
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre pseudo"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          S'inscrire
        </button>
      </form>
      <p class="text-sm text-center">
        Déjà un compte ?
        <a href="#" class="text-blue-500 hover:underline">Connectez-vous</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Variables réactives pour les champs du formulaire
const email = ref('')
const pseudo = ref('')
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
const handleSignup = async () => {
  const hashedEmail = await hashData(email.value)
  const hashedPassword = await hashData(password.value)

  console.log('Email (hash):', hashedEmail)
  console.log('Password (hash):', hashedPassword)

  try {
    const response = await fetch('api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: hashedEmail,
        password: hashedPassword,
        pseudo: pseudo.value,
      }),
    })

    if (response.ok) {
      console.log('Inscription réussie')
      router.push('login')
    } else {
      console.error("Erreur lors de l'inscription")
    }
  } catch (error) {
    console.error('Erreur réseau :', error)
  }
}
</script>

<style scoped>
/* Ajoutez des styles personnalisés si nécessaire */
</style>

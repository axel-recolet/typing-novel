<template>
  <img
    v-for="item in items"
    :key="item"
    :src="item.cover.content"
    :alt="item.title"
    @click="goToTypingNovel(item.id)"
    class="max-w-40 rounded-[.5vw] cursor-pointer"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const items = ref<any[]>([])
const router = useRouter()

function goToTypingNovel(id: string) {
  router.push(`/typing/novel/${id}`)
}

onMounted(async () => {
  try {
    const response = await fetch('api/novels/presentations')
    const data = await response.json()
    items.value = data.map((d) => {
      d.cover.content = `data:image/png;base64,${d.cover.content}`
      return d
    })
    console.log(data)
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error)
  }
})
</script>

<style lang="scss">
.p-card-title {
  font-size: 14px; // Change la taille du titre
  font-weight: bold;
}
.p-card-subtitle {
  font-size: 12px; // Change la taille du titre
}
</style>

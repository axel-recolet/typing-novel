<template>
  <div class="fixed bottom-6 right-6 flex flex-col items-center gap-2">
    <!-- Boutons secondaires -->
    <transition-group name="fab">
      <button
        v-if="showOptions"
        @click="increaseFontSize"
        class="bg-gray-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition hover:bg-blue-600"
        key="increase"
      >
        +
      </button>
      <button
        v-if="showOptions"
        @click="decreaseFontSize"
        class="bg-gray-500 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition hover:bg-red-600"
        key="decrease"
      >
        -
      </button>
    </transition-group>

    <!-- Bouton principal FAB -->
    <button
      @click="toggleOptions"
      class="bg-gray-800 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition hover:bg-gray-900"
    >
      ⚙️
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps<{ fontSize: number }>()
const emit = defineEmits<{
  (event: 'update:fontSize', value: number): void
}>()

const showOptions = ref(false)

const toggleOptions = () => {
  showOptions.value = !showOptions.value
}

const increaseFontSize = () => {
  console.debug('font size: ', props.fontSize)
  emit('update:fontSize', props.fontSize + 2)
}

const decreaseFontSize = () => {
  emit('update:fontSize', Math.max(10, props.fontSize - 2))
}
</script>

<style>
.fab-enter-active,
.fab-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

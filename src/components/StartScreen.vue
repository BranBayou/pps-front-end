<script setup>
import { ToteIcon } from './icons/WarehouseIcons';

const emit = defineEmits(['start']);
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <ToteIcon classes="w-20 h-20 text-indigo-500 mx-auto mb-4" />
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Pick &amp; Pack Assistant</h1>
      <p class="text-gray-600 mb-8">Ready to start your next picking job? Tap below to begin.</p>
      <button
        type="button"
        class="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform hover:scale-105"
        @click="emit('start')"
      >
        Start New Picking Job
      </button>
    </div>
  </div>
</template>


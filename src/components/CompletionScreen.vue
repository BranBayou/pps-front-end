<script setup>
import { CheckIcon } from './icons/WarehouseIcons';

defineProps({
  toteId: { type: String, required: true },
  totalItems: { type: Number, required: true },
});

const emit = defineEmits(['proceed']);
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckIcon classes="w-16 h-16 text-green-500" />
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Picking Complete!</h1>
      <p class="text-gray-600 mb-4">
        You have successfully picked all <span class="font-bold">{{ totalItems }}</span> items for Tote
        <span class="font-bold">{{ toteId }}</span>.
      </p>
      <p class="text-gray-600 mb-8">Please deliver the tote to the packing station.</p>
      <button
        type="button"
        class="w-full bg-purple-600 text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform hover:scale-105"
        @click="emit('proceed')"
      >
        Proceed to Packing
      </button>
    </div>
  </div>
</template>








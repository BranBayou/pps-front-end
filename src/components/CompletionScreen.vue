<script setup>
import { CheckIcon, MenuIcon } from './icons/WarehouseIcons';

defineProps({
  toteId: { type: String, required: true },
  totalItems: { type: Number, required: true },
});

const emit = defineEmits(['proceed', 'menu']);

const handleMenu = () => {
  emit('menu');
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-semibold text-gray-900">Picking complete</h1>
        <button type="button" class="p-2 hover:bg-gray-100 rounded-full" @click="handleMenu">
          <MenuIcon classes="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </header>

    <main class="flex flex-1 items-center justify-center p-4 text-center">
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
    </main>
  </div>
</template>








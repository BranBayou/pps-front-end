<script setup>
import { computed, ref, watch } from 'vue';
import { BinIcon, CheckIcon, ToteIcon } from '../icons/WarehouseIcons';

const props = defineProps({
  toteId: { type: String, required: true },
  currentItem: { type: Object, required: true },
  currentItemIndex: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  quantityToPick: { type: Number, required: true },
});

const emit = defineEmits(['item-scanned']);

const enteredQuantity = ref('1');

watch(
  () => props.quantityToPick,
  () => {
    enteredQuantity.value = '1';
  },
);

const isMultiPick = computed(() => props.currentItem.quantity > 1);

const quantityClasses = computed(() => (isMultiPick.value ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'));

const handleConfirm = () => {
  const quantity = parseInt(enteredQuantity.value, 10);
  if (Number.isNaN(quantity) || quantity <= 0 || quantity > props.quantityToPick) {
    window.alert(`Please enter a valid quantity between 1 and ${props.quantityToPick}.`);
    return;
  }
  emit('item-scanned', quantity);
};
</script>

<template>
  <div class="flex flex-col h-screen bg-white">
    <header class="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-10">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <ToteIcon classes="w-7 h-7" />
          <span class="font-bold text-lg">Tote: {{ toteId }}</span>
        </div>
        <div class="text-lg font-semibold bg-gray-700 px-3 py-1 rounded-full">
          {{ currentItemIndex + 1 }} / {{ totalItems }}
        </div>
      </div>
    </header>

    <main class="flex-grow p-4 md:p-6 flex flex-col justify-center text-center">
      <div class="bg-indigo-50 border-4 border-dashed border-indigo-200 rounded-2xl p-6 mb-6">
        <p class="text-lg font-semibold text-indigo-700 mb-2">GO TO BIN</p>
        <div class="flex items-center justify-center space-x-4">
          <BinIcon classes="w-16 h-16 text-indigo-500" />
          <h1 class="text-6xl md:text-7xl font-bold text-indigo-900 tracking-wider">{{ currentItem.bin }}</h1>
        </div>
      </div>

      <div class="bg-gray-100 p-4 rounded-2xl shadow-inner">
        <p class="text-lg font-semibold text-gray-600 mb-3 text-left">PICK ITEM</p>
        <div class="flex items-start space-x-4">
          <img :src="currentItem.imageUrl" :alt="currentItem.name" class="w-24 h-24 object-cover rounded-lg shadow-md border-2 border-white" />
          <div class="text-left flex-grow">
            <h2 class="text-2xl font-bold text-gray-900 leading-tight">
              {{ currentItem.name }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">SKU: {{ currentItem.sku }}</p>
            <p class="text-sm text-gray-500 font-medium">QoH: {{ currentItem.qoh }}</p>
          </div>
        </div>
        <div class="mt-4 text-3xl font-bold py-3 px-6 rounded-xl inline-block transition-colors duration-300" :class="quantityClasses">
          QTY: {{ quantityToPick }}
        </div>
      </div>
    </main>

    <footer class="p-4 sticky bottom-0 bg-white border-t border-gray-200">
      <div class="flex items-center space-x-4">
        <input
          v-model="enteredQuantity"
          type="number"
          class="w-28 text-center text-xl font-bold border-2 border-gray-300 rounded-xl p-4 focus:ring-green-500 focus:border-green-500"
          min="1"
          :max="quantityToPick"
          aria-label="Quantity picked"
        />
        <button
          type="button"
          class="w-full flex items-center justify-center space-x-3 bg-green-500 text-white font-bold py-5 px-6 rounded-xl text-xl hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform hover:scale-105"
          @click="handleConfirm"
        >
          <CheckIcon classes="w-8 h-8" />
          <span>Confirm Pick</span>
        </button>
      </div>
    </footer>
  </div>
</template>




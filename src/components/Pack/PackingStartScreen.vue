<script setup>
import { computed, ref } from 'vue';
import { CheckIcon, ScanIcon, ToteIcon } from '../icons/WarehouseIcons';

defineProps({
  toteId: { type: String, required: true },
});

const emit = defineEmits(['begin-packing']);

const scanStep = ref('tote');
const showCheck = ref(false);

const prompt = computed(() => {
  if (scanStep.value === 'tote') return 'Please scan the tote barcode to begin.';
  if (scanStep.value === 'deliveryNote') return 'Next, scan the delivery note to verify.';
  return 'Verification complete!';
});

const buttonLabel = computed(() => (scanStep.value === 'tote' ? 'Scan Tote' : 'Scan Delivery Note'));

const handleScan = () => {
  showCheck.value = true;
  setTimeout(() => {
    showCheck.value = false;
    if (scanStep.value === 'tote') {
      scanStep.value = 'deliveryNote';
    } else if (scanStep.value === 'deliveryNote') {
      scanStep.value = 'done';
      emit('begin-packing');
    }
  }, 700);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
      <div class="relative w-24 h-24 mx-auto mb-6">
        <ToteIcon classes="w-24 h-24 text-indigo-500 transition-transform duration-300" />
        <div
          class="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          :class="showCheck ? 'opacity-100' : 'opacity-0'"
        >
          <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <CheckIcon classes="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Packing Station</h1>
      <p class="text-gray-600 mb-4">Tote <span class="font-bold text-indigo-700">{{ toteId }}</span> is ready for packing.</p>
      <p class="text-lg text-gray-700 font-semibold mb-8 h-12 flex items-center justify-center">
        {{ prompt }}
      </p>
      <button
        type="button"
        class="w-full flex items-center justify-center space-x-3 bg-purple-600 text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all hover:scale-105 disabled:bg-gray-400 disabled:scale-100"
        :disabled="showCheck"
        @click="handleScan"
      >
        <ScanIcon classes="w-8 h-8" />
        <span>{{ buttonLabel }}</span>
      </button>
    </div>
  </div>
</template>








<script setup>
import { computed, ref, watch } from 'vue';
import { BoxIcon, CheckIcon, LoadingSpinner, ToteIcon, TruckIcon } from '../../components/icons/WarehouseIcons';
import { getShippingRates } from '../../services/shippingService';

const props = defineProps({
  toteId: { type: String, required: true },
  pickList: { type: Array, required: true },
  instructions: { type: Object, required: true },
});

const emit = defineEmits(['packing-complete']);

const BOX_COLORS = ['border-blue-400', 'border-green-400', 'border-yellow-400', 'border-purple-400', 'border-pink-400', 'border-indigo-400'];

const packedItemIndex = ref(0);
const quantityToScan = ref(0);
const enteredQuantity = ref('1');
const packingStep = ref('packing');
const shippingRates = ref([]);
const selectedRate = ref(null);

watch(
  () => props.pickList,
  (list) => {
    packedItemIndex.value = 0;
    quantityToScan.value = list[0]?.quantity ?? 0;
    enteredQuantity.value = '1';
    packingStep.value = 'packing';
    shippingRates.value = [];
    selectedRate.value = null;
  },
  { immediate: true },
);

const skuToBoxIndexMap = computed(() => {
  const map = new Map();
  props.instructions.boxes.forEach((box, boxIndex) => {
    box.itemSKUs.forEach((sku) => map.set(sku, boxIndex));
  });
  return map;
});

const currentItem = computed(() => (packingStep.value === 'packing' ? props.pickList[packedItemIndex.value] : null));
const currentItemName = computed(() => currentItem.value?.name ?? '');
const currentItemQuantity = computed(() => currentItem.value?.quantity ?? 0);

const handleConfirmPack = () => {
  if (!currentItem.value) return;
  const quantity = parseInt(enteredQuantity.value, 10);
  if (Number.isNaN(quantity) || quantity <= 0 || quantity > quantityToScan.value) {
    window.alert(`Please enter a valid quantity between 1 and ${quantityToScan.value}.`);
    return;
  }

  if (quantityToScan.value > quantity) {
    quantityToScan.value -= quantity;
    enteredQuantity.value = '1';
    return;
  }

  if (packedItemIndex.value < props.pickList.length - 1) {
    packedItemIndex.value += 1;
    quantityToScan.value = props.pickList[packedItemIndex.value].quantity;
    enteredQuantity.value = '1';
  } else {
    packedItemIndex.value = props.pickList.length;
    quantityToScan.value = 0;
    packingStep.value = 'selecting_courier';
  }
};

const handleFetchRates = async (courier) => {
  packingStep.value = 'fetching_rates';
  selectedRate.value = null;
  try {
    shippingRates.value = await getShippingRates(courier);
    packingStep.value = 'showing_rates';
  } catch (error) {
    console.error('Failed to fetch shipping rates', error);
    window.alert('Could not fetch shipping rates. Please try again.');
    packingStep.value = 'selecting_courier';
  }
};

const handleFinalizePacking = () => {
  if (!selectedRate.value) {
    window.alert('Please select a shipping rate.');
    return;
  }
  packingStep.value = 'finalized';
  setTimeout(() => {
    emit('packing-complete');
  }, 2500);
};

const isRateSelected = (rate) => selectedRate.value?.serviceName === rate.serviceName;
const selectRate = (rate) => {
  selectedRate.value = rate;
};
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <header class="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-10">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <ToteIcon classes="w-7 h-7" />
          <span class="font-bold text-lg">Packing Tote: {{ toteId }}</span>
        </div>
      </div>
    </header>

    <main class="flex-grow p-4 md:p-6 overflow-y-auto">
      <div class="bg-white p-5 rounded-2xl shadow mb-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          Recommended Boxes ({{ instructions.boxes.length }})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(box, index) in instructions.boxes"
            :key="box.boxSize + index"
            class="bg-indigo-50 border-l-8 rounded-lg p-4 flex items-start space-x-4"
            :class="BOX_COLORS[index % BOX_COLORS.length]"
          >
            <BoxIcon classes="w-10 h-10 text-indigo-500 mt-1 flex-shrink-0" />
            <div>
              <p class="text-lg font-bold text-indigo-900">{{ box.boxSize }} Box</p>
              <p class="text-sm text-gray-700">
                {{ box.contents }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-5 rounded-2xl shadow">
          <h2 class="text-xl font-bold text-gray-800 mb-3">Item Packing List</h2>
          <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
            <div
              v-for="(item, index) in pickList"
              :key="item.id"
              class="flex items-center space-x-3 p-2 rounded-lg transition-all border-l-8"
              :class="[
                index < packedItemIndex ? 'bg-green-100 border-green-400 opacity-60' : '',
                index === packedItemIndex && packingStep === 'packing'
                  ? ['bg-yellow-100', BOX_COLORS[(skuToBoxIndexMap.get(item.sku) ?? 0) % BOX_COLORS.length], 'ring-4 ring-yellow-300']
                  : '',
                index > packedItemIndex || packingStep !== 'packing'
                  ? ['bg-gray-100', BOX_COLORS[(skuToBoxIndexMap.get(item.sku) ?? 0) % BOX_COLORS.length]]
                  : '',
              ]"
            >
              <div
                class="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center border-2"
                :class="index < packedItemIndex ? 'bg-green-500 border-green-500' : 'border-gray-300'"
              >
                <CheckIcon v-if="index < packedItemIndex" classes="w-4 h-4 text-white" />
              </div>
              <img :src="item.imageUrl" :alt="item.name" class="w-12 h-12 object-cover rounded-md" />
              <div class="flex-grow">
                <p :class="index < packedItemIndex ? 'line-through text-gray-500' : 'text-gray-800 font-semibold'">
                  {{ item.name }}
                </p>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <span
                v-if="instructions.fragileItemSKUs.includes(item.sku)"
                class="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full"
              >
                FRAGILE
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow">
          <h2 class="text-xl font-bold text-gray-800 mb-3">General Instructions</h2>
          <ul class="space-y-2 list-decimal list-inside text-gray-700">
            <li v-for="(step, index) in instructions.instructions" :key="index">
              {{ step }}
            </li>
          </ul>
        </div>
      </div>
    </main>

    <footer class="p-4 sticky bottom-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-t-xl">
      <div v-if="packingStep === 'packing'" class="flex flex-col items-center w-full">
        <div class="mb-2 text-center">
          <p class="font-semibold">
            Packing: <span class="text-gray-800">{{ currentItemName }}</span>
          </p>
          <p class="text-sm text-gray-600">
            Remaining: <span class="font-bold text-blue-600">{{ quantityToScan }}</span> / {{ currentItemQuantity }}
          </p>
        </div>
        <div class="flex items-center space-x-4 w-full">
          <input
            v-model="enteredQuantity"
            type="number"
            class="w-28 text-center text-xl font-bold border-2 border-gray-300 rounded-xl p-4 focus:ring-blue-500 focus:border-blue-500"
            min="1"
            :max="quantityToScan"
            aria-label="Quantity to pack"
          />
          <button
            type="button"
            class="w-full flex items-center justify-center space-x-3 bg-purple-600 text-white font-bold py-5 px-6 rounded-xl text-xl hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform hover:scale-105"
            @click="handleConfirmPack"
          >
            <CheckIcon classes="w-8 h-8" />
            <span>Confirm</span>
          </button>
        </div>
      </div>

      <div v-else-if="packingStep === 'selecting_courier'" class="text-center w-full">
        <h3 class="text-xl font-bold mb-4 text-gray-800">Packing Complete!</h3>
        <p class="text-gray-600 mb-6">Please select a courier to get shipping rates.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            class="flex items-center justify-center space-x-3 bg-red-600 text-white font-bold py-5 px-6 rounded-xl text-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-transform hover:scale-105"
            @click="handleFetchRates('Canada Post')"
          >
            <TruckIcon classes="w-8 h-8" />
            <span>Canada Post</span>
          </button>
          <button
            type="button"
            class="flex items-center justify-center space-x-3 bg-indigo-600 text-white font-bold py-5 px-6 rounded-xl text-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform hover:scale-105"
            @click="handleFetchRates('Purolator')"
          >
            <TruckIcon classes="w-8 h-8" />
            <span>Purolator</span>
          </button>
        </div>
      </div>

      <div v-else-if="packingStep === 'fetching_rates'" class="flex flex-col items-center justify-center w-full text-gray-700 py-8">
        <LoadingSpinner classes="w-12 h-12 text-indigo-500" />
        <p class="text-xl font-semibold mt-4">Fetching shipping rates...</p>
      </div>

      <div v-else-if="packingStep === 'showing_rates'" class="w-full">
        <h3 class="text-xl font-bold mb-3 text-gray-800 text-center">Select Shipping Rate</h3>
        <div class="space-y-3 mb-4 max-h-48 overflow-y-auto">
          <label
            v-for="rate in shippingRates"
            :key="rate.serviceName"
            class="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="isRateSelected(rate) ? 'bg-indigo-100 border-indigo-500 ring-4 ring-indigo-200' : 'bg-white border-gray-200 hover:border-indigo-300'"
          >
            <div class="flex items-center">
              <input
                type="radio"
                name="shipping-rate"
                class="h-5 w-5 text-indigo-600"
                :checked="isRateSelected(rate)"
                @change="selectRate(rate)"
              />
              <div class="ml-4">
                <p class="font-bold text-gray-900">{{ rate.serviceName }}</p>
                <p class="text-sm text-gray-600">{{ rate.estimatedDelivery }}</p>
              </div>
            </div>
            <p class="text-xl font-bold text-indigo-800">${{ rate.rate.toFixed(2) }}</p>
          </label>
        </div>
        <div class="flex items-center space-x-4">
          <button
            type="button"
            class="w-1/3 bg-gray-200 text-gray-800 font-bold py-5 px-6 rounded-xl text-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
            @click="packingStep = 'selecting_courier'"
          >
            Back
          </button>
          <button
            type="button"
            class="w-2/3 flex items-center justify-center space-x-3 bg-green-500 text-white font-bold py-5 px-6 rounded-xl text-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed enabled:hover:bg-green-600 enabled:focus:outline-none enabled:focus:ring-4 enabled:focus:ring-green-300 enabled:hover:scale-105"
            :disabled="!selectedRate"
            @click="handleFinalizePacking"
          >
            <span>Confirm &amp; Print Label</span>
          </button>
        </div>
      </div>

      <div v-else-if="packingStep === 'finalized'" class="flex flex-col items-center justify-center w-full text-green-700 bg-green-50 rounded-xl py-8">
        <CheckIcon classes="w-16 h-16" />
        <p class="text-2xl font-semibold mt-4">Shipment Confirmed!</p>
        <p class="text-lg">Tote {{ toteId }} is ready for dispatch.</p>
      </div>
    </footer>
  </div>
</template>


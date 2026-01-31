<script setup>
import { computed, ref, watch } from 'vue';
import { BoxIcon, CheckIcon, InformationCircleIcon, LoadingSpinner, ToteIcon, TruckIcon, XIcon } from '../../components/icons/WarehouseIcons';
import { useShippingServiceStore } from '@/Stores/shippingServiceStore';

const shippingServiceStore = useShippingServiceStore();

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
const confirmedBoxes = ref([]);
const boxWeights = ref({});
const showInstructionsPopup = ref(false);

watch(
  () => props.pickList,
  (list) => {
    packedItemIndex.value = 0;
    quantityToScan.value = list[0]?.quantity ?? 0;
    enteredQuantity.value = '1';
    packingStep.value = 'packing';
    shippingRates.value = [];
    selectedRate.value = null;
    confirmedBoxes.value = [];
    boxWeights.value = {};
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
    packingStep.value = 'confirming_boxes';
    // Initialize confirmed boxes with all recommended boxes
    confirmedBoxes.value = props.instructions.boxes.map((box, index) => ({
      ...box,
      index,
      confirmed: true,
    }));
  }
};

const handleFetchRates = async (courier) => {
  packingStep.value = 'fetching_rates';
  selectedRate.value = null;
  try {
    shippingRates.value = await shippingServiceStore.getShippingRates(courier);
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

const toggleBoxConfirmation = (boxIndex) => {
  const box = confirmedBoxes.value[boxIndex];
  if (box) {
    box.confirmed = !box.confirmed;
    if (!box.confirmed) {
      // Clear weight when unconfirming
      delete boxWeights.value[box.index];
    }
  }
};

const updateBoxWeight = (boxIndex, weight) => {
  const box = confirmedBoxes.value[boxIndex];
  if (!box) return;
  
  const numWeight = parseFloat(weight);
  if (!isNaN(numWeight) && numWeight > 0) {
    boxWeights.value[box.index] = numWeight;
  } else {
    delete boxWeights.value[box.index];
  }
};

const canProceedToCourier = computed(() => {
  return confirmedBoxes.value.some((box) => box.confirmed) && 
         confirmedBoxes.value.every((box) => !box.confirmed || boxWeights.value[box.index] > 0);
});

const handleConfirmBoxes = () => {
  if (!canProceedToCourier.value) {
    window.alert('Please confirm at least one box and enter weights for all confirmed boxes.');
    return;
  }
  packingStep.value = 'selecting_courier';
};
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
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
            class="bg-purple-50 border-l-8 rounded-lg p-4 flex items-start space-x-4"
            :class="BOX_COLORS[index % BOX_COLORS.length]"
          >
            <BoxIcon classes="w-10 h-10 text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <p class="text-lg font-bold text-purple-900">{{ box.boxSize }} Box</p>
              <p class="text-sm text-gray-700">
                {{ box.contents }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1">
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
      </div>

      <!-- Floating Instructions button (bottom right) -->
      <button
        type="button"
        class="fixed bottom-24 right-6 z-20 flex items-center justify-center w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all md:bottom-8 md:right-8"
        aria-label="General instructions"
        @click="showInstructionsPopup = true"
      >
        <InformationCircleIcon classes="w-7 h-7" />
      </button>

      <!-- Instructions popup -->
      <Teleport to="body">
        <Transition name="popup">
          <div
            v-if="showInstructionsPopup"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            @click.self="showInstructionsPopup = false"
          >
            <div
              class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
              role="dialog"
              aria-labelledby="instructions-title"
              aria-modal="true"
            >
              <div class="flex items-center justify-between p-5 border-b border-gray-200 bg-purple-50 rounded-t-2xl">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white">
                    <InformationCircleIcon classes="w-6 h-6 text-white" />
                  </div>
                  <h2 id="instructions-title" class="text-xl font-bold text-gray-900">General packing Instructions</h2>
                </div>
                <button
                  type="button"
                  class="p-2 hover:bg-purple-100 rounded-full transition-colors"
                  aria-label="Close"
                  @click="showInstructionsPopup = false"
                >
                  <XIcon classes="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div class="p-5 overflow-y-auto flex-1">
                <ul class="space-y-3 list-decimal list-inside text-gray-700">
                  <li
                    v-for="(step, index) in instructions.instructions"
                    :key="index"
                    class="pl-1 leading-relaxed"
                  >
                    {{ step }}
                  </li>
                </ul>
              </div>
              <div class="p-5 border-t border-gray-200 rounded-b-2xl">
                <button
                  type="button"
                  class="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
                  @click="showInstructionsPopup = false"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
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

      <div v-else-if="packingStep === 'confirming_boxes'" class="w-full">
        <h3 class="text-xl font-bold mb-4 text-gray-800 text-center">Confirm Boxes & Weights</h3>
        <p class="text-gray-600 mb-6 text-center">Please confirm which boxes you used and enter the weight of each box with items inside.</p>
        <div class="space-y-4 mb-6 max-h-64 overflow-y-auto">
          <div
            v-for="(box, index) in confirmedBoxes"
            :key="index"
            class="bg-white border-2 rounded-xl p-4"
            :class="box.confirmed ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50'"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-start space-x-3 flex-1">
                <BoxIcon classes="w-8 h-8 text-purple-500 mt-1 flex-shrink-0" />
                <div class="flex-1">
                  <p class="text-lg font-bold text-gray-900">{{ box.boxSize }} Box</p>
                  <p class="text-sm text-gray-600 mt-1">{{ box.contents }}</p>
                </div>
              </div>
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="box.confirmed"
                  @change="toggleBoxConfirmation(index)"
                  class="h-5 w-5 rounded border-gray-300 text-purple-600 accent-purple-600 focus:ring-purple-500 checked:bg-purple-600"
                />
                <span class="ml-2 text-sm font-medium text-gray-700">Used</span>
              </label>
            </div>
            <div v-if="box.confirmed" class="mt-3">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                :value="boxWeights[box.index] || ''"
                @input="updateBoxWeight(index, $event.target.value)"
                placeholder="Enter weight"
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-semibold"
              />
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button
            type="button"
            class="w-1/3 bg-gray-200 text-gray-800 font-bold py-5 px-6 rounded-xl text-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
            @click="packingStep = 'packing'"
          >
            Back
          </button>
          <button
            type="button"
            class="w-2/3 flex items-center justify-center space-x-3 bg-purple-600 text-white font-bold py-5 px-6 rounded-xl text-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed enabled:hover:bg-purple-700 enabled:focus:outline-none enabled:focus:ring-4 enabled:focus:ring-purple-300 enabled:hover:scale-105"
            :disabled="!canProceedToCourier"
            @click="handleConfirmBoxes"
          >
            <CheckIcon classes="w-6 h-6" />
            <span>Confirm & Continue</span>
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
            :class="isRateSelected(rate) ? 'bg-purple-100 border-purple-500 ring-4 ring-purple-200' : 'bg-white border-gray-200 hover:border-purple-300'"
          >
            <div class="flex items-center">
              <input
                type="radio"
                name="shipping-rate"
                class="h-5 w-5 text-purple-600"
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

<style scoped>
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.2s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { computed, ref } from 'vue';
import CompletionScreen from './components/CompletionScreen.vue';
import PackingStartScreen from './components/PackingStartScreen.vue';
import PackingScreen from './components/Pack/PackingScreen.vue';
import PickingScreen from './components/Pick/PickingScreen.vue';
import StartScreen from './components/StartScreen.vue';
import { LoadingSpinner } from './components/icons/WarehouseIcons';
import { MOCK_PICK_LIST } from './data/mockPickList';
import { getPackingInstructions, optimizePickingRoute } from './services/workflowService';

const APP_STATES = {
  START: 'START',
  LOADING: 'LOADING',
  PICKING: 'PICKING',
  PICKING_COMPLETE: 'PICKING_COMPLETE',
  PACKING_START: 'PACKING_START',
  PACKING_LOADING: 'PACKING_LOADING',
  PACKING: 'PACKING',
  ERROR: 'ERROR',
};

const appState = ref(APP_STATES.START);
const toteId = ref('');
const pickList = ref([]);
const currentItemIndex = ref(0);
const quantityToPick = ref(0);
const packingInstructions = ref(null);
const error = ref('');

const currentItem = computed(() => pickList.value[currentItemIndex.value]);

const handleStartPicking = async () => {
  appState.value = APP_STATES.LOADING;
  error.value = '';
  toteId.value = `T${Math.floor(100000 + Math.random() * 900000)}`;
  currentItemIndex.value = 0;

  try {
    const optimizedList = await optimizePickingRoute(MOCK_PICK_LIST);
    pickList.value = optimizedList;
    quantityToPick.value = optimizedList[0]?.quantity ?? 0;
    appState.value = APP_STATES.PICKING;
  } catch (err) {
    console.error('Failed to start picking job', err);
    error.value = 'Could not optimize picking route. Using default order.';
    pickList.value = [...MOCK_PICK_LIST];
    quantityToPick.value = pickList.value[0]?.quantity ?? 0;
    appState.value = APP_STATES.PICKING;
  }
};

const handleItemScanned = (scannedQuantity) => {
  const remaining = quantityToPick.value - scannedQuantity;
  if (remaining > 0) {
    quantityToPick.value = remaining;
    return;
  }

  if (currentItemIndex.value < pickList.value.length - 1) {
    currentItemIndex.value += 1;
    quantityToPick.value = pickList.value[currentItemIndex.value].quantity;
  } else {
    appState.value = APP_STATES.PICKING_COMPLETE;
  }
};

const handleProceedToPacking = () => {
  appState.value = APP_STATES.PACKING_START;
};

const handleStartPacking = async () => {
  appState.value = APP_STATES.PACKING_LOADING;
  try {
    packingInstructions.value = await getPackingInstructions(pickList.value);
    appState.value = APP_STATES.PACKING;
  } catch (err) {
    console.error('Failed to get packing instructions', err);
    error.value = 'Could not retrieve packing instructions.';
    appState.value = APP_STATES.ERROR;
  }
};

const handleRestart = () => {
  appState.value = APP_STATES.START;
  toteId.value = '';
  pickList.value = [];
  currentItemIndex.value = 0;
  quantityToPick.value = 0;
  error.value = '';
  packingInstructions.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <StartScreen v-if="appState === APP_STATES.START" @start="handleStartPicking" />

    <div
      v-else-if="appState === APP_STATES.LOADING"
      class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700"
    >
      <LoadingSpinner classes="w-16 h-16 text-indigo-500" />
      <p class="text-xl font-semibold mt-4">Optimizing pick route...</p>
    </div>

    <PickingScreen
      v-else-if="appState === APP_STATES.PICKING && currentItem"
      :tote-id="toteId"
      :current-item="currentItem"
      :current-item-index="currentItemIndex"
      :total-items="pickList.length"
      :quantity-to-pick="quantityToPick"
      @item-scanned="handleItemScanned"
    />

    <div v-else-if="appState === APP_STATES.PICKING" class="flex items-center justify-center h-screen">
      No items to pick.
    </div>

    <CompletionScreen
      v-else-if="appState === APP_STATES.PICKING_COMPLETE"
      :tote-id="toteId"
      :total-items="pickList.length"
      @proceed="handleProceedToPacking"
    />

    <PackingStartScreen
      v-else-if="appState === APP_STATES.PACKING_START"
      :tote-id="toteId"
      @begin-packing="handleStartPacking"
    />

    <div
      v-else-if="appState === APP_STATES.PACKING_LOADING"
      class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700"
    >
      <LoadingSpinner classes="w-16 h-16 text-indigo-500" />
      <p class="text-xl font-semibold mt-4">Generating packing instructions...</p>
    </div>

    <PackingScreen
      v-else-if="appState === APP_STATES.PACKING && packingInstructions"
      :tote-id="toteId"
      :pick-list="pickList"
      :instructions="packingInstructions"
      @packing-complete="handleRestart"
    />

    <div
      v-else-if="appState === APP_STATES.ERROR"
      class="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center"
    >
      <p class="text-red-600 font-semibold">{{ error }}</p>
      <button
        type="button"
        class="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg"
        @click="handleRestart"
      >
        Start Over
      </button>
    </div>

    <StartScreen v-else @start="handleStartPicking" />
  </div>
</template>

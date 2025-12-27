<script setup>
import { computed, ref } from 'vue';
import CompletionScreen from './components/CompletionScreen.vue';
import Login from './components/Auth/Login.vue';
import Logout from './components/Auth/Logout.vue';
import MobileMenu from './components/MobileMenu.vue';
import PackingStartScreen from './components/Pack/PackingStartScreen.vue';
import PackingScreen from './components/Pack/PackingScreen.vue';
import PickingScreen from './components/Pick/PickingScreen.vue';
import StartScreen from './components/StartScreen.vue';
import { LoadingSpinner } from './components/icons/WarehouseIcons';
import { MOCK_PICK_LIST } from './data/mockPickList';
import { getPackingInstructions, optimizePickingRoute } from './services/workflowService';
import { useAuthStore } from './Stores/authStore';

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

const authStore = useAuthStore();

const appState = ref(APP_STATES.START);
const toteId = ref('');
const pickList = ref([]);
const pickedQuantities = ref({});
const packingInstructions = ref(null);
const error = ref('');
const isMenuOpen = ref(false);
const dashboardOverview = {
  userName: 'Valerie Cancian',
  filterStatus: 'Pending',
  warehouseName: 'Primary',
  orders: {
    readyToShip: 25,
    dueToday: 4,
    shippedToday: 5,
  },
  items: {
    readyToPick: 57,
    dueToday: 7,
    shippedToday: 16,
  },
};

const allItemsPicked = computed(() => {
  return pickList.value.every((item) => {
    const picked = pickedQuantities.value[item.id] || 0;
    return picked >= item.quantity;
  });
});

const handleStartPicking = async () => {
  appState.value = APP_STATES.LOADING;
  error.value = '';
  toteId.value = `T${Math.floor(100000 + Math.random() * 900000)}`;
  pickedQuantities.value = {};

  try {
    const optimizedList = await optimizePickingRoute(MOCK_PICK_LIST);
    pickList.value = optimizedList;
    appState.value = APP_STATES.PICKING;
  } catch (err) {
    console.error('Failed to start picking job', err);
    error.value = 'Could not optimize picking route. Using default order.';
    pickList.value = [...MOCK_PICK_LIST];
    appState.value = APP_STATES.PICKING;
  }
};

const handleItemPicked = ({ itemId, quantity }) => {
  const currentPicked = pickedQuantities.value[itemId] || 0;
  const item = pickList.value.find((i) => i.id === itemId);
  if (!item) return;

  const newPicked = Math.min(currentPicked + quantity, item.quantity);
  pickedQuantities.value[itemId] = newPicked;

  // Check if all items are picked
  if (allItemsPicked.value) {
    appState.value = APP_STATES.PICKING_COMPLETE;
  }
};

const handlePickingBack = () => {
  appState.value = APP_STATES.START;
};

const handlePickingProgress = () => {
  // Could show a progress modal or navigate to a progress screen
  // For now, we'll just log it
  console.log('Progress clicked');
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
  pickedQuantities.value = {};
  error.value = '';
  packingInstructions.value = null;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogin = ({ user, pin }) => {
  authStore.login({ user, pin });
};

const handleLoginClose = () => {
  authStore.closeLogin();
};

const handleLogoutClick = () => {
  isMenuOpen.value = false;
  authStore.openLogout();
};

const handleLogoutConfirm = () => {
  authStore.logout();
  appState.value = APP_STATES.START;
  handleRestart();
};

const handleLogoutCancel = () => {
  authStore.cancelLogout();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <Login v-if="authStore.showLogin" @login="handleLogin" @close="handleLoginClose" />
    <Logout v-if="authStore.showLogout" @confirm="handleLogoutConfirm" @cancel="handleLogoutCancel" />
    
    <template v-if="authStore.isAuthenticated">
      <MobileMenu :is-open="isMenuOpen" @close="closeMenu" @logout="handleLogoutClick" />
      
      <StartScreen v-if="appState === APP_STATES.START" :overview="dashboardOverview" @start="handleStartPicking" @open-menu="toggleMenu" />

      <div
        v-else-if="appState === APP_STATES.LOADING"
        class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700"
      >
        <LoadingSpinner classes="w-16 h-16 text-indigo-500" />
        <p class="text-xl font-semibold mt-4">Optimizing pick route...</p>
      </div>

      <PickingScreen
        v-else-if="appState === APP_STATES.PICKING && pickList.length > 0"
        :tote-id="toteId"
        :pick-list="pickList"
        :picked-quantities="pickedQuantities"
        @item-picked="handleItemPicked"
        @back="handlePickingBack"
        @progress="handlePickingProgress"
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

      <StartScreen v-else :overview="dashboardOverview" @start="handleStartPicking" />
    </template>
  </div>
</template>

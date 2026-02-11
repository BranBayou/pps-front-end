<script setup>
import { onMounted, ref } from 'vue';
import CompletionScreen from './CompletionScreen.vue';
import Login from './auth/Login.vue';
import Logout from './auth/Logout.vue';
import MobileMenu from './MobileMenu.vue';
import PackingStartScreen from './Pack/PackingStartScreen.vue';
import PackingScreen from './Pack/PackingScreen.vue';
import PickingScreen from './Pick/PickingScreen.vue';
import ScanToteScreen from './Pick/ScanToteScreen.vue';
import { LoadingSpinner, MenuIcon, ToteIcon } from './icons/WarehouseIcons';
import { useAuthStore } from '@/stores/authStore';
import { useWorkflowServiceStore } from '@/stores/workflowServiceStore';
import { useOrderStore } from '@/stores/orderStore';
import { usePickingStore } from '@/stores/pickingStore';
import { useAppState } from '@/composables/appState';

const workflowServiceStore = useWorkflowServiceStore();
const orderStore = useOrderStore();
const pickingStore = usePickingStore();
const { APP_STATES, appState, resetAppState } = useAppState();

const authStore = useAuthStore();
 
const toteId = ref('');
const pickList = ref([]);
const packingInstructions = ref(null);
const error = ref('');
const isMenuOpen = ref(false);

const greeting = 'Welcome, Gorilla Warehouse!';
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

const handleGoToScanTote = () => {
  appState.value = APP_STATES.SCAN_TOTE;
  localStorage.removeItem('pickList');
  pickingStore.resetPickList();
  pickList.value = [];
  toteId.value = '';
};

const handleToteSelected = ({ toteId: selectedToteId }) => {
  toteId.value = selectedToteId;
  handleStartPicking();
};

const handleStartPicking = async () => {
  appState.value = APP_STATES.LOADING;
  error.value = '';

  try {
    const optimizedList = await workflowServiceStore.optimizePickingRoute(orderStore.MOCK_PICK_LIST);
    pickList.value = optimizedList;
    pickingStore.addNewPickList({
      selectedTote: toteId.value,
      orders: optimizedList,
    });
    pickList.value = pickingStore.pickList.orders;
    appState.value = APP_STATES.PICKING;
  } catch (err) {
    console.error('Failed to start picking job', err);
    error.value = 'Could not optimize picking route. Using default order.';
    pickList.value = [...orderStore.MOCK_PICK_LIST];
    pickingStore.addNewPickList({
      selectedTote: toteId.value,
      orders: pickList.value,
    });
    pickList.value = pickingStore.pickList.orders;
    appState.value = APP_STATES.PICKING;
  }
};

const handleScanToteBack = () => {
  appState.value = APP_STATES.START;
};

const handlePickingBack = () => {
  appState.value = APP_STATES.SCAN_TOTE;
};

const handlePickingProgress = () => {
  console.log('Progress clicked');
};

const handleProceedToPacking = () => {
  appState.value = APP_STATES.PACKING_START;
};

const handleStartPacking = async () => {
  appState.value = APP_STATES.PACKING_LOADING;
  try {
    packingInstructions.value = await workflowServiceStore.getPackingInstructions(pickList.value);
    appState.value = APP_STATES.PACKING;
  } catch (err) {
    console.error('Failed to get packing instructions', err);
    error.value = 'Could not retrieve packing instructions.';
    appState.value = APP_STATES.ERROR;
  }
};

const handleRestart = () => {
  resetAppState();
  toteId.value = '';
  pickList.value = [];
  error.value = '';
  packingInstructions.value = null;
  pickingStore.resetPickList();
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
  handleRestart();
};

const handleLogoutCancel = () => {
  authStore.cancelLogout();
};

onMounted(() => {
  pickingStore.loadPickListFromLocalStorage();

  if (pickingStore.pickList.orders.length > 0) {
    pickList.value = pickingStore.pickList.orders;
    if (pickingStore.pickList.selectedTote?.id) {
      toteId.value = pickingStore.pickList.selectedTote.id;
    }
  }
});

</script>

<template>
  <div class="h-screen md:max-w-3xl md:mx-auto md:shadow-lg bg-gray-50 text-gray-900">
    <Login v-if="authStore.showLogin" @login="handleLogin" @close="handleLoginClose" />
    <Logout v-if="authStore.showLogout" @confirm="handleLogoutConfirm" @cancel="handleLogoutCancel" />

    <template v-if="authStore.userState.isAuthenticated">
      <MobileMenu :is-open="isMenuOpen" @close="closeMenu" @logout="handleLogoutClick" @start-new-picking="handleGoToScanTote" />

      <ScanToteScreen
        v-if="appState === APP_STATES.SCAN_TOTE"
        @select-tote="handleToteSelected"
        @back="handleScanToteBack"
        @menu="toggleMenu"
      />

      <div
        v-else-if="appState === APP_STATES.LOADING"
        class="flex flex-col min-h-screen bg-gray-50 text-gray-700"
      >
        <header class="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-semibold text-gray-900">Optimizing pick route</h1>
            <button type="button" class="p-2 hover:bg-gray-100 rounded-full" @click="toggleMenu">
              <MenuIcon classes="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </header>
        <main class="flex flex-1 flex-col items-center justify-center">
          <LoadingSpinner classes="w-16 h-16 text-indigo-500" />
          <p class="text-xl font-semibold mt-4">Optimizing pick route...</p>
        </main>
      </div>

      <PickingScreen
        v-else-if="appState === APP_STATES.PICKING && pickList.length > 0"
        :tote-id="toteId"
        :pick-list="pickList"
        @back="handlePickingBack"
        @progress="handlePickingProgress"
        @menu="toggleMenu"
      />

      <div v-else-if="appState === APP_STATES.PICKING" class="flex items-center justify-center h-screen">
        No items to pick.
      </div>

      <CompletionScreen
        v-else-if="appState === APP_STATES.PICKING_COMPLETE"
        :tote-id="toteId"
        :total-items="pickList.length"
        @proceed="handleProceedToPacking"
        @start-new-picking="handleGoToScanTote"
        @menu="toggleMenu"
      />

      <PackingStartScreen
        v-else-if="appState === APP_STATES.PACKING_START"
        :tote-id="toteId"
        @begin-packing="handleStartPacking"
        @menu="toggleMenu"
      />

      <div
        v-else-if="appState === APP_STATES.PACKING_LOADING"
        class="flex flex-col min-h-screen bg-gray-50 text-gray-700"
      >
        <header class="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-semibold text-gray-900">Generating packing instructions</h1>
            <button type="button" class="p-2 hover:bg-gray-100 rounded-full" @click="toggleMenu">
              <MenuIcon classes="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </header>
        <main class="flex flex-1 flex-col items-center justify-center">
          <LoadingSpinner classes="w-16 h-16 text-indigo-500" />
          <p class="text-xl font-semibold mt-4">Generating packing instructions...</p>
        </main>
      </div>

      <PackingScreen
        v-else-if="appState === APP_STATES.PACKING && packingInstructions"
        :tote-id="toteId"
        :pick-list="pickList"
        :instructions="packingInstructions"
        @packing-complete="handleRestart"
        @menu="toggleMenu"
      />

      <div
        v-else-if="appState === APP_STATES.ERROR"
        class="flex flex-col min-h-screen bg-red-50 p-4 text-center"
      >
        <header class="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-semibold text-gray-900">Error</h1>
            <button type="button" class="p-2 hover:bg-gray-100 rounded-full" @click="toggleMenu">
              <MenuIcon classes="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </header>
        <main class="flex flex-1 flex-col items-center justify-center">
          <p class="text-red-600 font-semibold">{{ error }}</p>
          <button
            type="button"
            class="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg"
            @click="handleRestart"
          >
            Start Over
          </button>
        </main>
      </div>

      <div v-else class="min-h-screen bg-gray-50 flex flex-col">
        <header class="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <h1 class="text-lg font-semibold text-gray-900">Dashboard</h1>
            <button type="button" class="p-2 hover:bg-gray-100 rounded-full" @click="toggleMenu">
              <MenuIcon classes="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </header>
        <main class="flex flex-1 items-center justify-center p-4">
          <div class="w-full max-w-3xl space-y-6">
          <div class="bg-white rounded-3xl shadow-lg p-8">
            <!-- <p class="text-sm text-gray-500">
              These are your orders for
              <span class="text-indigo-600 font-semibold cursor-pointer">{{ dashboardOverview.filterStatus }}</span>
              status in
              <span class="text-indigo-600 font-semibold cursor-pointer">{{ dashboardOverview.warehouseName }}</span>
              warehouse
            </p> -->
            <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ greeting }}</h1>

            <div class="mt-6 grid grid-cols-2 gap-6">
              <div class="border border-slate-200 rounded-2xl p-6">
                <h2 class="text-sm uppercase tracking-wide text-slate-500">Orders</h2>
                <div class="mt-4 space-y-2 text-slate-700">
                  <p>
                    <span class="text-3xl font-bold text-slate-900">{{ dashboardOverview.orders.readyToShip }}</span>
                    ready to ship
                  </p>
                  <p><span class="font-semibold text-slate-900">{{ dashboardOverview.orders.dueToday }}</span> due today</p>
                  <p><span class="font-semibold text-slate-900">{{ dashboardOverview.orders.shippedToday }}</span> shipped today</p>
                </div>
              </div>

              <div class="border border-slate-200 rounded-2xl p-6">
                <h2 class="text-sm uppercase tracking-wide text-slate-500">Items</h2>
                <div class="mt-4 space-y-2 text-slate-700">
                  <p>
                    <span class="text-3xl font-bold text-slate-900">{{ dashboardOverview.items.readyToPick }}</span>
                    ready to pick
                  </p>
                  <p><span class="font-semibold text-slate-900">{{ dashboardOverview.items.dueToday }}</span> due today</p>
                  <p><span class="font-semibold text-slate-900">{{ dashboardOverview.items.shippedToday }}</span> shipped today</p>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 text-center">
            <!-- <p class="text-slate-600 text-lg font-medium mb-6">How would you like to process them?</p> -->
            <button
              type="button"
              class="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-2xl bg-purple-600 text-white text-lg font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-transform hover:-translate-y-0.5"
              @click="handleGoToScanTote"
            >
              <ToteIcon classes="w-6 h-6 text-white mr-3" />
              Start New Picking
            </button>
          </div>
        </div>
        </main>
      </div>
    </template>
  </div>
</template>




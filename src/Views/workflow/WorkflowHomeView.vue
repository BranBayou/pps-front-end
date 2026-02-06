<script setup>
import { useRouter } from 'vue-router';
import { ToteIcon } from '@/components/icons/WarehouseIcons';

const router = useRouter();

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
  router.push({ name: 'ScanTote' });
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
    <div class="w-full max-w-3xl space-y-6">
      <div class="bg-white rounded-3xl shadow-lg p-8">
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
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ToteIcon } from './icons/WarehouseIcons';

const props = defineProps({
  overview: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['start']);

const greeting = computed(() => `Welcome, Gorilla Store!`);
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-3xl space-y-6">
      <div class="bg-white rounded-3xl shadow-lg p-8">
        <p class="text-sm text-gray-500">
          These are your orders for
          <span class="text-indigo-600 font-semibold cursor-pointer">{{ overview.filterStatus }}</span>
          status in
          <span class="text-indigo-600 font-semibold cursor-pointer">{{ overview.warehouseName }}</span>
          warehouse
        </p>
        <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ greeting }}</h1>

        <div class="mt-6 grid grid-cols-2 gap-6">
          <div class="border border-slate-200 rounded-2xl p-6">
            <h2 class="text-sm uppercase tracking-wide text-slate-500">Orders</h2>
            <div class="mt-4 space-y-2 text-slate-700">
              <p><span class="text-3xl font-bold text-slate-900">{{ overview.orders.readyToShip }}</span> ready to ship</p>
              <p><span class="font-semibold text-slate-900">{{ overview.orders.dueToday }}</span> due today</p>
              <p><span class="font-semibold text-slate-900">{{ overview.orders.shippedToday }}</span> shipped today</p>
            </div>
          </div>

          <div class="border border-slate-200 rounded-2xl p-6">
            <h2 class="text-sm uppercase tracking-wide text-slate-500">Items</h2>
            <div class="mt-4 space-y-2 text-slate-700">
              <p><span class="text-3xl font-bold text-slate-900">{{ overview.items.readyToPick }}</span> ready to pick</p>
              <p><span class="font-semibold text-slate-900">{{ overview.items.dueToday }}</span> due today</p>
              <p><span class="font-semibold text-slate-900">{{ overview.items.shippedToday }}</span> shipped today</p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 text-center">
        <!-- <p class="text-slate-600 text-lg font-medium mb-6">How would you like to process them?</p> -->
        <button
          type="button"
          class="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-2xl bg-purple-600 text-white text-lg font-semibold shadow-lg shadow-purple-200 hover:bg-purple-700 transition-transform hover:-translate-y-0.5"
          @click="emit('start')"
        >
          <ToteIcon classes="w-6 h-6 text-white mr-3" />
          Start New Picking
        </button>
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ScanToteScreen from '@/components/Pick/ScanToteScreen.vue';
import { LoadingSpinner } from '@/components/icons/WarehouseIcons';
import { useOrderStore } from '@/Stores/orderStore';
import { usePickingStore } from '@/Stores/pickingStore';
import { useWorkflowServiceStore } from '@/Stores/workflowServiceStore';

const router = useRouter();
const orderStore = useOrderStore();
const pickingStore = usePickingStore();
const workflowServiceStore = useWorkflowServiceStore();

const isLoading = ref(false);

const handleToteSelected = async ({ toteId }) => {
  isLoading.value = true;
  try {
    const optimizedList = await workflowServiceStore.optimizePickingRoute(orderStore.MOCK_PICK_LIST);
    pickingStore.addNewPickList({
      selectedTote: toteId,
      orders: optimizedList,
    });
  } catch (err) {
    console.error('Failed to start picking job', err);
    pickingStore.addNewPickList({
      selectedTote: toteId,
      orders: orderStore.MOCK_PICK_LIST,
    });
  } finally {
    isLoading.value = false;
  }

  router.push({ name: 'Picking' });
};

const handleScanToteBack = () => {
  router.push({ name: 'WorkflowHome' });
};
</script>

<template>
  <div
    v-if="isLoading"
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700"
  >
    <LoadingSpinner classes="w-16 h-16 text-indigo-500" />
    <p class="text-xl font-semibold mt-4">Optimizing pick route...</p>
  </div>

  <ScanToteScreen
    v-else
    @select-tote="handleToteSelected"
    @back="handleScanToteBack"
  />
</template>

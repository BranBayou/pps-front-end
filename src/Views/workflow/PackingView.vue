<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PackingScreen from '@/components/Pack/PackingScreen.vue';
import { LoadingSpinner } from '@/components/icons/WarehouseIcons';
import { usePickingStore } from '@/Stores/pickingStore';
import { useWorkflowServiceStore } from '@/Stores/workflowServiceStore';

const router = useRouter();
const pickingStore = usePickingStore();
const workflowServiceStore = useWorkflowServiceStore();

const isLoading = ref(false);
const packingInstructions = ref(null);

const toteId = computed(() => pickingStore.pickList.selectedTote?.id || '');
const pickList = computed(() => pickingStore.pickList.orders);

const loadPackingInstructions = async () => {
  if (packingInstructions.value || pickList.value.length === 0) return;
  isLoading.value = true;
  try {
    packingInstructions.value = await workflowServiceStore.getPackingInstructions(pickList.value);
  } catch (err) {
    console.error('Failed to get packing instructions.', err);
    router.push({
      name: 'WorkflowError',
      query: { message: 'Could not retrieve packing instructions.' },
    });
  } finally {
    isLoading.value = false;
  }
};

const handlePackingComplete = () => {
  router.push({ name: 'WorkflowHome' });
};

onMounted(() => {
  pickingStore.loadPickListFromLocalStorage();
  loadPackingInstructions();
});
</script>

<template>
  <div
    v-if="isLoading"
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700"
  >
    <LoadingSpinner classes="w-16 h-16 text-indigo-500" />
    <p class="text-xl font-semibold mt-4">Generating packing instructions...</p>
  </div>

  <PackingScreen
    v-else-if="packingInstructions"
    :tote-id="toteId"
    :pick-list="pickList"
    :instructions="packingInstructions"
    @packing-complete="handlePackingComplete"
  />
</template>

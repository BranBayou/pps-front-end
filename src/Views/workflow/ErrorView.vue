<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePickingStore } from '@/Stores/pickingStore';

const route = useRoute();
const router = useRouter();
const pickingStore = usePickingStore();

const message = computed(() => route.query.message || 'Something went wrong.');

const handleRestart = () => {
  pickingStore.addNewPickList({ selectedTote: '', orders: [] });
  router.push({ name: 'WorkflowHome' });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center">
    <p class="text-red-600 font-semibold">{{ message }}</p>
    <button
      type="button"
      class="mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg"
      @click="handleRestart"
    >
      Start Over
    </button>
  </div>
</template>

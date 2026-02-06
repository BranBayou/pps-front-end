<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CompletionScreen from '@/components/CompletionScreen.vue';
import { usePickingStore } from '@/Stores/pickingStore';

const router = useRouter();
const pickingStore = usePickingStore();

const toteId = computed(() => pickingStore.pickList.selectedTote?.id || '');
const totalItems = computed(() => pickingStore.pickList.orders.length);

const handleProceedToPacking = () => {
  router.push({ name: 'PackingStart' });
};

onMounted(() => {
  pickingStore.loadPickListFromLocalStorage();
});
</script>

<template>
  <CompletionScreen
    :tote-id="toteId"
    :total-items="totalItems"
    @proceed="handleProceedToPacking"
  />
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PackingStartScreen from '@/components/Pack/PackingStartScreen.vue';
import { usePickingStore } from '@/Stores/pickingStore';

const router = useRouter();
const pickingStore = usePickingStore();

const toteId = computed(() => pickingStore.pickList.selectedTote?.id || '');

const handleStartPacking = () => {
  router.push({ name: 'Packing' });
};

onMounted(() => {
  pickingStore.loadPickListFromLocalStorage();
});
</script>

<template>
  <PackingStartScreen
    :tote-id="toteId"
    @begin-packing="handleStartPacking"
  />
</template>

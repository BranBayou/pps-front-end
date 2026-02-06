<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PickingScreen from '@/components/Pick/PickingScreen.vue';
import { usePickingStore } from '@/Stores/pickingStore';

const router = useRouter();
const pickingStore = usePickingStore();

const pickedQuantities = ref({});

const pickList = computed(() => pickingStore.pickList.orders);
const toteId = computed(() => pickingStore.pickList.selectedTote?.id || '');

const allItemsPicked = computed(() => {
  return pickList.value.every((item) => {
    if (item.isPicked) return true;
    const picked = pickedQuantities.value[item.id] || 0;
    return picked >= item.quantity;
  });
});

const handleItemPicked = ({ itemId, quantity }) => {
  const currentPicked = pickedQuantities.value[itemId] || 0;
  const item = pickList.value.find((i) => i.id === itemId);
  if (!item || item.isPicked) return;

  const newPicked = Math.min(currentPicked + quantity, item.quantity);
  pickedQuantities.value[itemId] = newPicked;
  if (newPicked >= item.quantity) {
    item.isPicked = true;
  }
  pickingStore.savePickListInLocalStorage();

  if (allItemsPicked.value) {
    router.push({ name: 'PickingComplete' });
  }
};

const handlePickingBack = () => {
  router.push({ name: 'ScanTote' });
};

const handlePickingProgress = () => {
  console.log('Progress clicked');
};

onMounted(() => {
  pickingStore.loadPickListFromLocalStorage();
});
</script>

<template>
  <PickingScreen
    v-if="pickList.length > 0"
    :tote-id="toteId"
    :pick-list="pickList"
    :picked-quantities="pickedQuantities"
    @item-picked="handleItemPicked"
    @back="handlePickingBack"
    @progress="handlePickingProgress"
  />

  <div v-else class="flex items-center justify-center h-screen">
    No items to pick.
  </div>
</template>

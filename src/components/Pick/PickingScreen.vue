<script setup>
import { computed, ref } from 'vue';
import { ArrowLeftIcon, CheckIcon, ToteIcon } from '../icons/WarehouseIcons';
import PickQuantityPopup from './PickQuantityPopup.vue';

const props = defineProps({
  toteId: { type: String, required: true },
  pickList: { type: Array, required: true },
  pickedQuantities: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['item-picked', 'back', 'progress']);

const getRemainingQuantity = (item) => {
  if (item.isPicked) return 0;
  const picked = props.pickedQuantities[item.id] || 0;
  return Math.max(0, item.quantity - picked);
};

const isItemComplete = (item) => {
  return getRemainingQuantity(item) === 0;
};

const totalItemsLeft = computed(() => {
  return props.pickList.reduce((total, item) => {
    return total + getRemainingQuantity(item);
  }, 0);
});

const totalOrders = computed(() => {
  return 7;
});

const selectedItem = ref(null);

const remainingForSelected = computed(() =>
  selectedItem.value ? getRemainingQuantity(selectedItem.value) : 0
);

const openPickPopup = (item) => {
  if (isItemComplete(item)) return;
  selectedItem.value = item;
};

const closePickPopup = () => {
  selectedItem.value = null;
};

const handleConfirmPick = ({ itemId, quantity }) => {
  emit('item-picked', { itemId, quantity });
  closePickPopup();
};

const handleItemPick = (item, quantity = 1) => {
  if (isItemComplete(item)) return;
  emit('item-picked', { itemId: item.id, quantity });
};

const handleItemRowClick = (item) => {
  if (!isItemComplete(item)) {
    openPickPopup(item);
  }
};

const handleBack = () => {
  emit('back');
};

const handleProgress = () => {
  emit('progress');
};
</script>

<template>
  <div class="flex flex-col h-screen bg-white md:max-w-3xl md:mx-auto md:shadow-lg">
    <header class="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div class="flex justify-between items-center">
        <button type="button" class="p-2 hover:bg-gray-100 rounded-full" @click="handleBack">
          <ArrowLeftIcon classes="w-6 h-6 text-gray-700" />
        </button>
        <div class="flex flex-col items-center flex-1">
          <h1 class="text-lg font-semibold text-gray-900">Items to pick</h1>
          <div class="flex items-center space-x-2 mt-1">
            <ToteIcon classes="w-5 h-5 text-gray-600" />
            <span class="text-sm font-medium text-gray-700">Tote: {{ toteId }}</span>
          </div>
        </div>
        <button type="button" class="text-blue-600 font-medium hover:text-blue-700" @click="handleProgress">
          Progress
        </button>
      </div>
    </header>

    <main class="flex-grow overflow-y-auto">
      <div class="divide-y divide-gray-200">
        <div
          v-for="item in pickList"
          :key="item.id"
          class="p-4 transition-colors cursor-pointer"
          :class="{
            'bg-green-100 opacity-75': item.isPicked,
            'hover:bg-gray-100': !isItemComplete(item),
            'hover:bg-green-200': isItemComplete(item),
          }"
          @click="handleItemRowClick(item)"
        >
          <div class="flex items-start gap-4">
            <!-- Left: Pick Quantity -->
            <div class="flex flex-col items-center flex-shrink-0 w-16">
              <div class="text-base text-gray-500 mt-1 font-medium">Pick</div>
              <div class="text-4xl font-bold text-gray-900 leading-none">{{ getRemainingQuantity(item) }}</div>
            </div>

            <!-- Center: Product Details -->
            <div class="flex-1 flex items-start gap-3 min-w-0">
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="w-14 h-14 object-cover rounded flex-shrink-0 border border-gray-200"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-500">SKU: {{ item.sku }}</p>
                <p class="text-base font-semibold text-gray-900 mt-0.5 leading-tight">{{ item.name }}</p>
                <p class="text-sm text-gray-500 mt-1">Bin: {{ item.bin }}</p>
              </div>
            </div>

            <div v-if="item.isPicked" class="mt-1">
                <CheckIcon classes="w-10 h-10 text-green-600" />
              </div>

            <!-- Right: On Hand & Options -->
            <div class="flex-shrink-0 flex flex-col items-end gap-2">
              <div class="text-right">
                <p class="text-base text-gray-600">QoH:</p>
                <p class="text-sm font-semibold text-gray-900">{{ item.qoh }}</p>
              </div>
              <button
                type="button"
                class="p-1 hover:bg-gray-200 rounded-full transition-colors"
                @click.stop="handleItemPick(item, 1)"
              >
                <!-- <DotsVerticalIcon classes="w-5 h-5 text-gray-600" /> -->
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-white border-t border-gray-200 p-4 sticky bottom-0">
      <div class="flex justify-between items-center">
        <p class="text-sm text-gray-600">
          You have <span class="font-semibold">{{ totalOrders }}</span> orders
        </p>
        <p class="text-sm font-semibold text-red-600">
          <span class="font-bold">{{ totalItemsLeft }}</span> items left to pick
        </p>
      </div>
    </footer>

    <PickQuantityPopup
      :item="selectedItem"
      :tote-id="toteId"
      :remaining="remainingForSelected"
      @confirm="handleConfirmPick"
      @close="closePickPopup"
    />
  </div>
</template>

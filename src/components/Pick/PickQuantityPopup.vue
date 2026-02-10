<script setup>
import { computed, ref, watch } from 'vue';
import { ToteIcon } from '../icons/WarehouseIcons';

const props = defineProps({
  item: { type: Object, default: null },
  toteId: { type: String, required: true },
  remaining: { type: Number, required: true },
});

const emit = defineEmits(['confirm', 'close']);

const pickQuantity = ref(1);

watch(
  () => props.item,
  (newItem) => {
    if (newItem) pickQuantity.value = 1;
  },
  { immediate: true }
);

const canDecrement = computed(() => pickQuantity.value > 1);
const canIncrement = computed(() => pickQuantity.value < props.remaining);

function decrementQuantity() {
  if (pickQuantity.value > 1) pickQuantity.value -= 1;
}

function incrementQuantity() {
  if (pickQuantity.value < props.remaining) pickQuantity.value += 1;
}

function clampInput() {
  const n = parseInt(pickQuantity.value, 10);
  pickQuantity.value = Math.max(1, Math.min(props.remaining, isNaN(n) ? 1 : n));
}

function handleConfirm() {
  const qty = Math.min(pickQuantity.value, props.remaining);
  if (qty < 1 || !props.item) return;
  emit('confirm', { itemId: props.item.id, quantity: qty });
  emit('close');
}

function handleClose() {
  emit('close');
}
</script>

<template>
  <Teleport to="body">
    <Transition name="pick-popup">
      <div
        v-if="item"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="handleClose"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-sm border-4 overflow-hidden"
          role="dialog"
          aria-labelledby="pick-popup-title"
          aria-modal="true"
        >
          <div class="flex justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div class="">
              <p id="pick-popup-title" class="text-lg font-bold text-gray-900">{{ item.name }}</p>
              <p class="text-sm text-gray-500 mt-0.5">Barcode: {{ item.barcode }}</p>
              <p class="text-sm text-gray-500 mt-0.5">SKU: {{ item.sku }}</p>
            </div>
            <img :src="item.imageUrl" alt="Item Image" class="w-32 h-32 object-cover rounded-lg mt-2">
          </div>

          <div class="p-5 space-y-4">
            <p class="text-center font-semibold text-gray-900">
              Pick {{ remaining }} more {{ remaining === 1 ? 'Unit' : 'Units' }}
            </p>
            <p class="text-center text-sm text-gray-600">from {{ item.bin }}</p>
            <p class="text-sm font-medium text-gray-700 text-center">How many are you picking?</p>
            <div class="flex items-center justify-center gap-4">
              <button
                type="button"
                class="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none"
                :disabled="!canDecrement"
                @click="decrementQuantity"
              >
                −
              </button>
              <input
                v-model.number="pickQuantity"
                type="number"
                min="1"
                :max="remaining"
                class="w-20 text-center text-2xl text-gray-600 font-bold border-2 rounded-xl py-2 focus:ring-purple-300"
                @input="clampInput"
              />
              <button
                type="button"
                class="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none"
                :disabled="!canIncrement"
                @click="incrementQuantity"
              >
                +
              </button>
            </div>
            <div class="flex items-center justify-center gap-2 pt-2">
              <ToteIcon classes="w-6 h-6 text-green-600" />
              <p class="text-sm text-gray-600">Put picked items in <span class="font-bold text-gray-900">{{ toteId }}</span></p>
            </div>
          </div>

          <div class="p-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300"
              @click="handleConfirm"
            >
              Pick
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pick-popup-enter-active,
.pick-popup-leave-active {
  transition: opacity 0.2s ease;
}
.pick-popup-enter-from,
.pick-popup-leave-to {
  opacity: 0;
}
</style>

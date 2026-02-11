<script setup>
import { BoxIcon, CheckIcon, XIcon } from '../../components/icons/WarehouseIcons';

const props = defineProps({
  show: { type: Boolean, default: false },
  confirmedBoxes: { type: Array, default: () => [] },
  boxWeights: { type: Object, default: () => ({}) },
  canProceed: { type: Boolean, default: false },
});

const emit = defineEmits(['back', 'toggle-box', 'update-weight', 'confirm', 'close']);

const handleBackdropClick = () => {
  emit('close');
};

const handleToggleBox = (index) => {
  emit('toggle-box', index);
};

const handleUpdateWeight = (index, value) => {
  emit('update-weight', index, value);
};

const handleConfirm = () => {
  emit('confirm');
};

const handleBack = () => {
  emit('back');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm-popup">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="handleBackdropClick"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
          role="dialog"
          aria-labelledby="confirm-boxes-title"
          aria-modal="true"
        >
          <div class="flex items-center justify-between p-5 border-b border-gray-200 bg-purple-50 rounded-t-2xl">
            <h2 id="confirm-boxes-title" class="text-xl font-bold text-gray-900">Confirm Boxes &amp; Weights</h2>
            <button
              type="button"
              class="p-2 hover:bg-purple-100 rounded-full transition-colors"
              aria-label="Close"
              @click="handleBackdropClick"
            >
              <XIcon classes="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div class="p-5 overflow-y-auto flex-1">
            <p class="text-gray-600 mb-6 text-center">
              Please confirm which boxes you used and enter the weight of each box with items inside.
            </p>
            <div class="space-y-4">
              <div
                v-for="(box, index) in confirmedBoxes"
                :key="index"
                class="bg-white border-2 rounded-xl p-4"
                :class="box.confirmed ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-gray-50'"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-start space-x-3 flex-1">
                    <BoxIcon classes="w-8 h-8 text-purple-500 mt-1 flex-shrink-0" />
                    <div class="flex-1">
                      <p class="text-lg font-bold text-gray-900">{{ box.boxSize }} Box</p>
                      <p class="text-sm text-gray-600 mt-1">{{ box.contents }}</p>
                    </div>
                  </div>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="box.confirmed"
                      class="h-5 w-5 rounded border-gray-300 text-purple-600 accent-purple-600 focus:ring-purple-500 checked:bg-purple-600"
                      @change="handleToggleBox(index)"
                    />
                    <span class="ml-2 text-sm font-medium text-gray-700">Used</span>
                  </label>
                </div>
                <div v-if="box.confirmed" class="mt-3 flex">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Weight (lbs):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    :value="boxWeights[box.index] || ''"
                    placeholder="Enter weight"
                    class="w-full px-4 py-2 text-black border-2 border-gray-300 rounded-lg text-lg font-semibold"
                    @input="handleUpdateWeight(index, $event.target.value)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="p-5 border-t border-gray-200 rounded-b-2xl flex items-center space-x-4">
            <button
              type="button"
              class="w-1/3 bg-gray-200 text-gray-800 font-bold py-5 px-6 rounded-xl text-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
              @click="handleBack"
            >
              Back
            </button>
            <button
              type="button"
              class="w-2/3 flex items-center justify-center space-x-3 bg-purple-600 text-white font-bold py-5 px-6 rounded-xl text-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed enabled:hover:bg-purple-700 enabled:focus:outline-none enabled:focus:ring-4 enabled:focus:ring-purple-300 enabled:hover:scale-105"
              :disabled="!canProceed"
              @click="handleConfirm"
            >
              <CheckIcon classes="w-6 h-6" />
              <span>Confirm &amp; Continue</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-popup-enter-active,
.confirm-popup-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-popup-enter-from,
.confirm-popup-leave-to {
  opacity: 0;
}
</style>

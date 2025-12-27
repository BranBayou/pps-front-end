<script setup>
const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Confirm Logout</h2>
      <p class="text-gray-700 mb-6">Are you sure you want to logout?</p>
      <div class="flex space-x-3">
        <button
          type="button"
          class="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
          @click="handleConfirm"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

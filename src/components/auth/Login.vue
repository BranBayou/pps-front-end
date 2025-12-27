<script setup>
import { ref } from 'vue';
import { BackspaceIcon, CheckIcon, ChevronDownIcon, ExpandIcon, LockIcon } from '../icons/WarehouseIcons';

const emit = defineEmits(['login', 'close']);

const selectedUser = ref('Dee Bak');
const pin = ref('');
const showUserDropdown = ref(false);

const users = ['Dee Bak', 'Valerie Cancian', 'John Doe', 'Jane Smith'];

const handleNumberClick = (number) => {
  if (pin.value.length < 6) {
    pin.value += number.toString();
  }
};

const handleBackspace = () => {
  pin.value = pin.value.slice(0, -1);
};

const handleConfirm = () => {
  if (pin.value.length >= 4) {
    emit('login', { user: selectedUser.value, pin: pin.value });
    pin.value = '';
  }
};

const handleClose = () => {
  emit('close');
};

const selectUser = (user) => {
  selectedUser.value = user;
  showUserDropdown.value = false;
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex-1 relative">
          <button
            type="button"
            class="w-full flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 hover:bg-gray-100"
            @click="showUserDropdown = !showUserDropdown"
          >
            <span class="text-gray-900 font-medium">{{ selectedUser }}</span>
            <ChevronDownIcon classes="w-5 h-5 text-gray-500" />
          </button>
          <div
            v-if="showUserDropdown"
            class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            <button
              v-for="user in users"
              :key="user"
              type="button"
              class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              :class="selectedUser === user ? 'bg-purple-50 text-purple-700' : 'text-gray-900'"
              @click="selectUser(user)"
            >
              {{ user }}
            </button>
          </div>
        </div>
        <button
          type="button"
          class="ml-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          @click="handleClose"
        >
          <ExpandIcon classes="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <!-- PIN Input Field -->
      <div class="p-6">
        <div class="relative">
          <LockIcon classes="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            :value="pin"
            readonly
            placeholder="Enter PIN"
            class="w-full pl-12 pr-4 py-2 font-semibold text-center border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
          />
        </div>
      </div>

      <!-- Numeric Keypad -->
      <div class="px-6 pb-6">
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="num in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
            :key="num"
            type="button"
            class="py-2 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-2xl font-semibold text-gray-900 transition-colors"
            @click="handleNumberClick(num)"
          >
            {{ num }}
          </button>
          <button
            type="button"
            class="py-2 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 transition-colors flex items-center justify-center"
            @click="handleBackspace"
          >
            <BackspaceIcon classes="w-6 h-6" />
          </button>
          <button
            type="button"
            class="py-2 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-2xl font-semibold text-gray-900 transition-colors"
            @click="handleNumberClick(0)"
          >
            0
          </button>
          <button
            type="button"
            class="py-2 rounded-lg bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white transition-colors flex items-center justify-center"
            @click="handleConfirm"
          >
            <CheckIcon classes="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Close Button -->
      <div class="p-6 pt-0">
        <!-- <button
          type="button"
          class=" p-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
          @click="handleClose"
        >
          Close
        </button> -->
      </div>
    </div>
  </div>
</template>

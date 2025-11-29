<script setup>
import { computed } from 'vue';
import { ArrowLeftIcon, BoxIcon, CheckIcon, MenuIcon, ToteIcon, TruckIcon, XIcon } from './icons/WarehouseIcons';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};

// Sample menu lists - these could be made dynamic via props
const activeOrders = [
  { id: '1', toteId: 'T123456', status: 'Picking', items: 7 },
  { id: '2', toteId: 'T234567', status: 'Packing', items: 5 },
  { id: '3', toteId: 'T345678', status: 'Picking', items: 12 },
];

const recentCompleted = [
  { id: '1', toteId: 'T111111', completedAt: '2 hours ago', items: 8 },
  { id: '2', toteId: 'T222222', completedAt: '5 hours ago', items: 15 },
  { id: '3', toteId: 'T333333', completedAt: '1 day ago', items: 6 },
];

const pendingTasks = [
  { id: '1', task: 'Review inventory levels', priority: 'High', due: 'Today' },
  { id: '2', task: 'Update bin locations', priority: 'Medium', due: 'Tomorrow' },
  { id: '3', task: 'Quality check batch #45', priority: 'Low', due: 'This week' },
];

const quickActions = [
  { id: '1', label: 'New Pick List', icon: ToteIcon, action: 'new-pick' },
  { id: '2', label: 'View Inventory', icon: BoxIcon, action: 'inventory' },
  { id: '3', label: 'Shipping Status', icon: TruckIcon, action: 'shipping' },
  { id: '4', label: 'Completed Orders', icon: CheckIcon, action: 'completed' },
];
</script>

<template>
  <Transition name="menu">
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="handleClose">
      <div class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto" @click.stop>
        <div class="sticky top-0 bg-indigo-600 text-white p-4 flex justify-between items-center z-10">
          <h2 class="text-xl font-bold">Menu</h2>
          <button type="button" class="p-2 hover:bg-indigo-700 rounded-full transition-colors" @click="handleClose">
            <XIcon classes="w-6 h-6" />
          </button>
        </div>

        <div class="p-4 space-y-6">
          <!-- Quick Actions -->
          <section>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <button
                v-for="action in quickActions"
                :key="action.id"
                type="button"
                class="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors text-left"
              >
                <component :is="action.icon" classes="w-5 h-5 text-indigo-600" />
                <span class="font-medium text-gray-900">{{ action.label }}</span>
              </button>
            </div>
          </section>

          <!-- Active Orders -->
          <section>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Active Orders</h3>
            <div class="space-y-2">
              <div
                v-for="order in activeOrders"
                :key="order.id"
                class="p-3 bg-gray-50 rounded-lg border-l-4"
                :class="{
                  'border-yellow-400': order.status === 'Picking',
                  'border-blue-400': order.status === 'Packing',
                }"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold text-gray-900">{{ order.toteId }}</span>
                  <span
                    class="text-xs px-2 py-1 rounded-full font-medium"
                    :class="{
                      'bg-yellow-100 text-yellow-800': order.status === 'Picking',
                      'bg-blue-100 text-blue-800': order.status === 'Packing',
                    }"
                  >
                    {{ order.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">{{ order.items }} items</p>
              </div>
            </div>
          </section>

          <!-- Recent Completed -->
          <section>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Recent Completed</h3>
            <div class="space-y-2">
              <div
                v-for="order in recentCompleted"
                :key="order.id"
                class="p-3 bg-green-50 rounded-lg border-l-4 border-green-400"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="font-semibold text-gray-900">{{ order.toteId }}</span>
                  <CheckIcon classes="w-5 h-5 text-green-600" />
                </div>
                <p class="text-sm text-gray-600">{{ order.items }} items</p>
                <p class="text-xs text-gray-500 mt-1">{{ order.completedAt }}</p>
              </div>
            </div>
          </section>

          <!-- Pending Tasks -->
          <section>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Pending Tasks</h3>
            <div class="space-y-2">
              <div
                v-for="task in pendingTasks"
                :key="task.id"
                class="p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-start justify-between mb-1">
                  <span class="font-medium text-gray-900">{{ task.task }}</span>
                  <span
                    class="text-xs px-2 py-1 rounded-full font-medium ml-2"
                    :class="{
                      'bg-red-100 text-red-800': task.priority === 'High',
                      'bg-yellow-100 text-yellow-800': task.priority === 'Medium',
                      'bg-gray-100 text-gray-800': task.priority === 'Low',
                    }"
                  >
                    {{ task.priority }}
                  </span>
                </div>
                <p class="text-xs text-gray-500">Due: {{ task.due }}</p>
              </div>
            </div>
          </section>

          <!-- User Info -->
          <section class="pt-4 border-t border-gray-200">
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">VC</span>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-900">Valerie Cancian</p>
                <p class="text-sm text-gray-600">Warehouse Operator</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-enter-active .absolute,
.menu-leave-active .absolute {
  transition: transform 0.3s ease;
}

.menu-enter-from .absolute,
.menu-leave-to .absolute {
  transform: translateX(100%);
}
</style>


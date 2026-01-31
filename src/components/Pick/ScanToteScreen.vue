<script setup>
import { computed, ref } from 'vue';
import { ArrowLeftIcon, SearchIcon, ToteIcon } from '../icons/WarehouseIcons';

const emit = defineEmits(['select-tote', 'back']);

const searchQuery = ref('');

const totes = ref([
  { id: '1', barcode: '616450345' },
  { id: '2', barcode: '616450363' },
  { id: '3', barcode: '616450377' },
  { id: '4', barcode: '616450385' },
  { id: '5', barcode: '709517769' },
  { id: '6', barcode: '709517770' },
  { id: '7', barcode: '709518840' },
  { id: '8', barcode: '709518841' },
  { id: '9', barcode: '709518842' },
]);

const filteredTotes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return totes.value;
  return totes.value.filter(
    (t) =>
      t.name.toLowerCase().includes(q) || t.barcode.includes(q)
  );
});

const selectTote = (tote) => {
  emit('select-tote', { toteId: tote.name, barcode: tote.barcode });
};

const handleBack = () => {
  emit('back');
};
</script>

<template>
  <div class="flex flex-col h-screen bg-white md:max-w-3xl md:mx-auto md:shadow-lg">
    <header class="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          @click="handleBack"
        >
          <ArrowLeftIcon classes="w-6 h-6 text-gray-700" />
        </button>
        <h1 class="text-lg font-semibold text-gray-900 flex-1">Scan tote barcode</h1>
      </div>
    </header>

    <div class="p-4 border-b border-gray-200">
      <div class="relative">
        <SearchIcon classes="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search totes..."
          class="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <main class="flex-1 overflow-y-auto">
      <ul class="divide-y divide-gray-200">
        <li
          v-for="tote in filteredTotes"
          :key="tote.id"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors"
          @click="selectTote(tote)"
        >
          <div
            class="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"
          >
            <ToteIcon classes="w-7 h-7 text-gray-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-500 mt-0.5">Barcode {{ tote.barcode }}</p>
          </div>
        </li>
      </ul>
      <p
        v-if="filteredTotes.length === 0"
        class="p-6 text-center text-gray-500"
      >
        No totes match your search.
      </p>
    </main>
  </div>
</template>

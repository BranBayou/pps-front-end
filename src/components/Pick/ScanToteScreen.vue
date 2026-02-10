<script setup>
import { computed, ref, nextTick, onUnmounted } from 'vue';
import { ArrowLeftIcon, MenuIcon, SearchIcon, ToteIcon } from '../icons/WarehouseIcons';
import { usePickingStore } from '@/stores/pickingStore';
import { barcodeScannerService } from '@/services/barcodeScannerService';

const emit = defineEmits(['select-tote', 'back', 'menu']);

const searchQuery = ref('');
const pickingStore = usePickingStore();
const isScanning = ref(false);
const scannerError = ref('');
const scannerTarget = ref(null);
const lastDetected = ref('');

const filteredTotes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return pickingStore.totes;
  return pickingStore.totes.filter(
    (t) =>
      t.id.toLowerCase().includes(q) || t.barcode.includes(q)
  );
});

const selectTote = (tote) => {
  emit('select-tote', { toteId: tote.barcode });
};

const handleBack = () => {
  emit('back');
};

const handleMenu = () => {
  emit('menu');
};

const stopScanner = () => {
  barcodeScannerService.stop();
  isScanning.value = false;
};

const normalizeBarcode = (value) => String(value || '').trim();

const handleSearchEnter = () => {
  const code = normalizeBarcode(searchQuery.value);
  if (!code) return;
  const matchingTote = pickingStore.totes.find((tote) => {
    const barcode = normalizeBarcode(tote.barcode);
    const id = String(tote.id || '').trim().toLowerCase();
    return barcode === code || id === code.toLowerCase();
  });
  if (matchingTote) {
    selectTote(matchingTote);
  }
};

const startScanner = async () => {
  scannerError.value = '';
  isScanning.value = true;

  await nextTick();

  try {
    await barcodeScannerService.start({
      target: scannerTarget.value,
      onDetected: (result) => {
        const code = normalizeBarcode(result?.codeResult?.code);
        if (!code) return;
        lastDetected.value = code;
        const matchingTote = pickingStore.totes.find(
          (tote) => normalizeBarcode(tote.barcode) === code
        );
        if (matchingTote) {
          selectTote(matchingTote);
          stopScanner();
          return;
        }
        searchQuery.value = code;
      },
      onProcessed: (result) => {
        const drawingCanvas = document.querySelector(
          '.scanner-preview canvas.drawingBuffer'
        );
        if (!drawingCanvas || !result) return;
        const ctx = drawingCanvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        if (result.boxes) {
          result.boxes
            .filter((box) => box !== result.box)
            .forEach((box) => {
              ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(box[0][0], box[0][1]);
              box.forEach((point, index) => {
                if (index === 0) return;
                ctx.lineTo(point[0], point[1]);
              });
              ctx.closePath();
              ctx.stroke();
            });
        }
        if (result.box) {
          ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(result.box[0][0], result.box[0][1]);
          result.box.forEach((point, index) => {
            if (index === 0) return;
            ctx.lineTo(point[0], point[1]);
          });
          ctx.closePath();
          ctx.stroke();
        }
        if (result.codeResult && result.codeResult.code) {
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(result.line[0].x, result.line[0].y);
          ctx.lineTo(result.line[1].x, result.line[1].y);
          ctx.stroke();
        }
      },
    });
  } catch (error) {
    console.error('Failed to start barcode scanner', error);
    scannerError.value = 'Camera access failed. Please check permissions.';
    stopScanner();
  }
};

onUnmounted(() => {
  stopScanner();
});
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
        <button
          type="button"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          @click="handleMenu"
        >
          <MenuIcon classes="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </header>

    <div class="p-4 border-b border-gray-200 space-y-3">
      <div class="relative">
        <SearchIcon classes="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search totes..."
          class="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          @keyup.enter="handleSearchEnter"
        />
      </div>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          @click="startScanner"
          v-if="!isScanning"
        >
          Scan Tote Barcode
        </button>
        <button
          type="button"
          class="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
          @click="stopScanner"
          v-else
        >
          Stop Scanning
        </button>
      </div>
      <p v-if="scannerError" class="text-sm text-red-600">{{ scannerError }}</p>
      <p v-if="lastDetected" class="text-xs text-gray-500">
        Last detected: {{ lastDetected }}
      </p>
    </div>

    <main class="flex-1 overflow-y-auto">
      <div v-if="isScanning" class="p-4">
        <div
          ref="scannerTarget"
          class="scanner-preview w-full h-64 rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center text-white"
        >
          Starting camera...
        </div>
      </div>
      <!-- <ul class="divide-y divide-gray-200">
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
      </ul> -->
      <p
        class="p-6 text-center text-gray-500"
        v-if="filteredTotes.length === 0"
      >
        No totes match your search.
      </p>
    </main>
  </div>
</template>

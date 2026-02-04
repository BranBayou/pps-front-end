import { ref, onMounted, onUnmounted, computed} from 'vue';

export function useAppState() {
    const APP_STATES = {
      START: 'START',
      SCAN_TOTE: 'SCAN_TOTE',
      LOADING: 'LOADING',
      PICKING: 'PICKING',
      PICKING_COMPLETE: 'PICKING_COMPLETE',
      PACKING_START: 'PACKING_START',
      PACKING_LOADING: 'PACKING_LOADING',
      PACKING: 'PACKING',
      ERROR: 'ERROR',
    };

    return {
      APP_STATES,
    };
}
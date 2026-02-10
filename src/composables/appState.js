import { ref, watch } from 'vue';

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

const STORAGE_KEY = 'appState';
const appState = ref(APP_STATES.START);
let isInitialized = false;

const loadSavedState = () => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState && Object.values(APP_STATES).includes(savedState)) {
      appState.value = savedState;
    }
  } catch (error) {
    console.warn('Unable to load app state from localStorage', error);
  }
};

const init = () => {
  if (isInitialized) return;
  isInitialized = true;
  loadSavedState();
  watch(
    appState,
    (nextState) => {
      try {
        localStorage.setItem(STORAGE_KEY, nextState);
      } catch (error) {
        console.warn('Unable to save app state to localStorage', error);
      }
    },
    { flush: 'post' }
  );
};

const resetAppState = () => {
  appState.value = APP_STATES.START;
};

export function useAppState() {
  init();
  return {
    APP_STATES,
    appState,
    resetAppState,
  };
}
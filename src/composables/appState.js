import { ref, watch } from 'vue';

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

  const STORAGE_KEY = 'appState';
  const appState = ref(APP_STATES.START);

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

  const resetAppState = () => {
    appState.value = APP_STATES.START;
  };

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

  return {
    APP_STATES,
    appState,
    resetAppState,
  };
}
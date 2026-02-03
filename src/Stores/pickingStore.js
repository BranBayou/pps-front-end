import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const usePickingStore = defineStore('picking', () => {
    // Lists of available totes for picking
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

    const newPickList = reactive({
      selectedTote: {},
      orders: [],
    });

    return {
        totes,
        newPickList,
    };
});

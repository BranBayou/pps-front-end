/**
 * Picking Store
 * 
 * Manages the state and operations related to the picking process in the warehouse.
 * This store handles:
 * - Available totes for picking operations
 * - Current pick list with selected tote and associated orders
 * - Persistence of pick lists to localStorage
 * 
 * @module Stores/pickingStore
 * @exports {Function} usePickingStore - Pinia store for picking operations
 */

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

    function addNewPickList(pickList) {
        newPickList.selectedTote.id = pickList.selectedTote;
        newPickList.orders = [];

        for (const order of pickList.orders) {
            newPickList.orders.push(order);
        }
        savePickListInLocalStorage();
    }

    function savePickListInLocalStorage() {
        localStorage.setItem('pickList', JSON.stringify(newPickList));
    }

    function loadPickListFromLocalStorage() {
        const storedPickList = localStorage.getItem('pickList');
        if (storedPickList) {
            const parsedPickList = JSON.parse(storedPickList);
            newPickList.selectedTote = parsedPickList.selectedTote;
            newPickList.orders = parsedPickList.orders;
        }
    };

    return {
        totes,
        newPickList,

        addNewPickList,
        savePickListInLocalStorage,
        loadPickListFromLocalStorage,
    };
});

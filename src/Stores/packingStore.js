import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePackingStore = defineStore('packing', () => {

    function savePackingListInlocalStorage() {
    const timestamp = new Date().toISOString();
       const newPackList = localStorage.getItem('pickList');
       localStorage.setItem(`packingList_${timestamp}`, JSON.stringify(newPackList));
    }
    
    return {
        savePackingListInlocalStorage,
    };
});

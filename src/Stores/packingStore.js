import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePackingStore = defineStore('packing', () => {

    function savePackingListInlocalStorage() {
       const counter = ref(0); 
       const newPackList = localStorage.getItem('pickList');
       localStorage.setItem('packingList', newPackList);
    }
    
    return {
        savePackingListInlocalStorage,
    };
});

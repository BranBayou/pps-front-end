import { defineStore } from 'pinia';

export const usePackingStore = defineStore('packing', () => {

    function savePackingListInlocalStorage() {
    const timestamp = new Date().toISOString();
       const newPackList = localStorage.getItem('pickList');
       localStorage.setItem(`packingList_${timestamp}`, newPackList);
    }

    function getActiveOrders() {
      return Object.keys(localStorage)
        .filter((key) => key.startsWith('packingList_'))
        .sort()
        .reverse()
        .map((key) => ({
          id: key,
          toteId: key.replace('packingList_', ''),
          status: 'Packing',
          label: `Tote: ${JSON.parse(localStorage.getItem(key))?.selectedTote?.id || 'Unknown'}`,
        }));
    }

    return {
        savePackingListInlocalStorage,
        getActiveOrders,
    };
});

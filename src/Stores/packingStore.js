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
        .map((key) => {
          let parsed = null;
          try {
            parsed = JSON.parse(localStorage.getItem(key));
          } catch (error) {
            parsed = null;
          }
          const toteId = parsed?.selectedTote?.id || 'Unknown';
          return {
            id: key,
            storageKey: key,
            toteId,
            status: 'Packing',
            label: `Tote: ${toteId}`,
          };
        });
    }

    return {
        savePackingListInlocalStorage,
        getActiveOrders,
    };
});

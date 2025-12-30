import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../plugins/axios';

export const useWorkflowServiceStore = defineStore('workflowService', () => {
    const delay = (ms = 1200) => new Promise((resolve) => setTimeout(resolve, ms));
    
    const optimizePickingRoute = async (pickList) => {
      await delay();
      const sorted = [...pickList].sort((a, b) => a.bin.localeCompare(b.bin));
      return sorted;
    };

    const getPackingInstructions = async (pickList) => {
      await delay();
      const fragileItemSKUs = pickList
        .filter((item) => ['glass', 'bottle', 'ceramic'].some((term) => item.name.toLowerCase().includes(term)))
        .map((item) => item.sku);
    
      return {
        boxes: [
          {
            boxSize: 'Medium',
            contents: 'Electronics and books',
            itemSKUs: pickList.slice(0, 3).map((item) => item.sku),
          },
          {
            boxSize: 'Large',
            contents: 'Bulk and oversized goods',
            itemSKUs: pickList.slice(3).map((item) => item.sku),
          },
        ],
        instructions: [
          'Place heavier items at the bottom of each box.',
          'Use bubble wrap for fragile items and fill voids with paper.',
          'Include delivery note on top before sealing.',
        ],
        fragileItemSKUs,
      };
    };
    
    return {
      optimizePickingRoute,
      getPackingInstructions,
    };
});

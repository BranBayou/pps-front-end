import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../plugins/axios';

export const useShippingServiceStore = defineStore('shippingService', () => {
    // const shippingServices = ref([]);

    // const getShippingServices = async () => {
    //     try {
    //         const response = await api.get('/v1/shipping-services');
    //         shippingServices.value = response.data;
    //     } catch (error) {
    //         console.error('Failed to fetch shipping services:', error);
    //         throw error;
    //     }
    // };
            
    // return {
    //     shippingServices,
    //     getShippingServices,
    // };
    const delay = (ms = 1500) => new Promise((resolve) => setTimeout(resolve, ms));
    const getShippingRates = async (courier) => {
      await delay();
    
      if (courier === 'Canada Post') {
        return [
          { courier: 'Canada Post', serviceName: 'Regular Parcel', rate: 15.5, estimatedDelivery: '5-7 business days' },
          { courier: 'Canada Post', serviceName: 'Xpresspost', rate: 25, estimatedDelivery: '2-3 business days' },
          { courier: 'Canada Post', serviceName: 'Priority', rate: 45.75, estimatedDelivery: '1-2 business days' },
        ];
      }
    
      if (courier === 'Purolator') {
        return [
          { courier: 'Purolator', serviceName: 'Purolator Ground', rate: 18.25, estimatedDelivery: '4-6 business days' },
          { courier: 'Purolator', serviceName: 'Purolator Express', rate: 30.5, estimatedDelivery: '1-2 business days' },
        ];
      }
    
      return [];
    };
    
    return {
      getShippingRates,
    };
});
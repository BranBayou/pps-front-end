import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../plugins/axios';

export const useShippingServiceStore = defineStore('shippingService', () => {
    const shippingServices = ref([]);

    const getShippingServices = async () => {
        try {
            const response = await api.get('/v1/shipping-services');
            shippingServices.value = response.data;
        } catch (error) {
            console.error('Failed to fetch shipping services:', error);
            throw error;
        }
    };
            
    return {
        shippingServices,
        getShippingServices,
    };
});
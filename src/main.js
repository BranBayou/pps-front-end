import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Toast from "vue-toastification";
import 'vue-toastification/dist/index.css'
import App from './App.vue';
import api from './plugins/axios';

const app = createApp(App);
const pinia = createPinia();
app.use(PrimeVue);
app.use(pinia);
app.config.globalProperties.$api = api;
app.use(Toast, {
  position: 'bottom-left',
});
app.provide('api', api);
app.mount('#app');
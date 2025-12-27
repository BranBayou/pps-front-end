import { create_router, createWebHistory } from 'vue-router';
import Login from '@/components/auth/Login.vue';
import Dashboard from '@/components/dashboard/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
];

const router = create_router({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
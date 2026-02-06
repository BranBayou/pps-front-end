<script setup>
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import Login from './Auth/Login.vue';
import Logout from './Auth/Logout.vue';
import MobileMenu from './MobileMenu.vue';
import { MenuIcon } from './icons/WarehouseIcons';
import { useAuthStore } from '@/Stores/authStore';
import { usePickingStore } from '@/Stores/pickingStore';

const authStore = useAuthStore();
const pickingStore = usePickingStore();
const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogin = ({ user, pin }) => {
  authStore.login({ user, pin });
};

const handleLoginClose = () => {
  authStore.closeLogin();
};

const handleLogoutClick = () => {
  isMenuOpen.value = false;
  authStore.openLogout();
};

const handleLogoutConfirm = () => {
  authStore.logout();
  pickingStore.addNewPickList({ selectedTote: '', orders: [] });
  router.push({ name: 'WorkflowHome' });
};

const handleLogoutCancel = () => {
  authStore.cancelLogout();
};
</script>

<template>
  <div class="h-screen md:max-w-3xl md:mx-auto md:shadow-lg bg-gray-50 text-gray-900 relative">
    <Login v-if="authStore.showLogin" @login="handleLogin" @close="handleLoginClose" />
    <Logout v-if="authStore.showLogout" @confirm="handleLogoutConfirm" @cancel="handleLogoutCancel" />

    <template v-if="authStore.userState.isAuthenticated">
      <MobileMenu :is-open="isMenuOpen" @close="closeMenu" @logout="handleLogoutClick" />
      <button
        type="button"
        class="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
        @click="toggleMenu"
      >
        <MenuIcon classes="w-6 h-6 text-gray-700" />
      </button>
      <RouterView />
    </template>
  </div>
</template>




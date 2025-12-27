import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const showLogin = ref(true);
  const showLogout = ref(false);
  const currentUser = ref('Dee Bak');

  const login = ({ user, pin }) => {
    // Simple authentication - in real app, this would validate with backend
    if (pin.length >= 4) {
      currentUser.value = user;
      isAuthenticated.value = true;
      showLogin.value = false;
      return true;
    }
    return false;
  };

  const closeLogin = () => {
    // Don't allow closing login if not authenticated
    if (!isAuthenticated.value) {
      return;
    }
    showLogin.value = false;
  };

  const openLogout = () => {
    showLogout.value = true;
  };

  const logout = () => {
    isAuthenticated.value = false;
    showLogout.value = false;
    showLogin.value = true;
    // Reset user to default
    currentUser.value = 'Dee Bak';
  };

  const cancelLogout = () => {
    showLogout.value = false;
  };

  return {
    isAuthenticated,
    showLogin,
    showLogout,
    currentUser,
    login,
    closeLogin,
    openLogout,
    logout,
    cancelLogout,
  };
});

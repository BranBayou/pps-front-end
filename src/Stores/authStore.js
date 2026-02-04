import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast();
  const isAuthenticated = ref(false);

  const userState = reactive({
    currentUser: localStorage.getItem('currentUser') || null,
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
  });

  const showLogin = ref(!userState.isAuthenticated);
  const showLogout = ref(false);

  const login = ({ user, pin }) => {
    // Simple authentication - in real app, this would validate with backend
    if (pin.length >= 4) {
      userState.currentUser = user;
      userState.isAuthenticated = true;
      showLogin.value = false;
      localStorage.setItem('currentUser', user);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const closeLogin = () => {
    // Don't allow closing login if not authenticated
    if (!userState.isAuthenticated) {
      return;
    }
    showLogin.value = false;
  };

  const openLogout = () => {
    showLogout.value = true;
  };

  const logout = () => {
    userState.isAuthenticated = false;
    userState.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
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
    userState,
    login,
    closeLogin,
    openLogout,
    logout,
    cancelLogout,
  };
});

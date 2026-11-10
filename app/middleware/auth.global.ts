import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  if (!auth.initialized) {
    await auth.fetchUser(useRequestFetch());
  }

  const isLoginPage = to.path === '/login';
  if (!auth.isLoggedIn && !isLoginPage) {
    return navigateTo('/login', { replace: true });
  }
  if (auth.isLoggedIn && isLoginPage) {
    return navigateTo('/', { replace: true });
  }
});

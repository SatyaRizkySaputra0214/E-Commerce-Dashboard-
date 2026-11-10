import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ApiSuccess } from '#shared/types/api';
import type { AuthUser } from '#shared/types/auth';

/** Minimal shape of $fetch / useRequestFetch used by the store. */
type JsonFetcher = <T>(url: string) => Promise<T>;

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const initialized = ref(false);

  const isLoggedIn = computed(() => user.value !== null);
  const isAdmin = computed(() => user.value?.role === 'admin');

  /** Loads the current user once per app boot; tolerates missing sessions. */
  async function fetchUser(fetcher: JsonFetcher = $fetch): Promise<void> {
    try {
      const response = await fetcher<ApiSuccess<AuthUser>>('/api/auth/me');
      user.value = response.data;
    } catch {
      user.value = null;
    } finally {
      initialized.value = true;
    }
  }

  /** Logs in with credentials; throws the API failure envelope on bad credentials. */
  async function login(email: string, password: string): Promise<void> {
    const response = await $fetch<ApiSuccess<AuthUser>>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    user.value = response.data;
  }

  /** Ends the server session and clears the local user. */
  async function logout(): Promise<void> {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      user.value = null;
    }
  }

  return { user, initialized, isLoggedIn, isAdmin, fetchUser, login, logout };
});

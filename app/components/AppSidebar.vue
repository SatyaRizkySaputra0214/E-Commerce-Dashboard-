<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

withDefaults(
  defineProps<{
    collapsed?: boolean;
    toggleable?: boolean;
  }>(),
  { collapsed: false, toggleable: false },
);

const emit = defineEmits<{ navigate: []; toggle: [] }>();

const auth = useAuthStore();
const notifications = useNotificationsStore();
const route = useRoute();
const signingOut = ref(false);

const links = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Products', to: '/products', icon: 'products' },
  { label: 'Orders', to: '/orders', icon: 'orders' },
] as const;

function isActive(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`);
}

async function onLogout(): Promise<void> {
  signingOut.value = true;
  try {
    await auth.logout();
    notifications.success('Signed out successfully.');
    emit('navigate');
    await navigateTo('/login', { replace: true });
  } finally {
    signingOut.value = false;
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      v-if="collapsed"
      class="flex flex-col items-center gap-2 pt-1 pb-6"
    >
      <AppMonogram class="h-8 w-8 text-ink" />
      <button
        v-if="toggleable"
        type="button"
        class="flex h-7 w-7 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-hover hover:text-ink"
        aria-label="Expand sidebar"
        @click="emit('toggle')"
      >
        <AppIcon
          name="chevron-right"
          class="h-4 w-4"
        />
      </button>
    </div>
    <div
      v-else
      class="flex items-center gap-2.5 px-1 pt-1 pb-6"
    >
      <AppMonogram class="h-8 w-8 shrink-0 text-ink" />
      <div class="min-w-0 flex-1 leading-tight">
        <p class="truncate text-[15px] font-semibold tracking-tight text-ink">Loka Store</p>
        <p class="text-xs text-ink-3">Admin Console</p>
      </div>
      <button
        v-if="toggleable"
        type="button"
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-hover hover:text-ink"
        aria-label="Collapse sidebar"
        @click="emit('toggle')"
      >
        <AppIcon
          name="chevron-left"
          class="h-4 w-4"
        />
      </button>
    </div>

    <nav
      class="flex-1 space-y-0.5"
      aria-label="Main navigation"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :title="collapsed ? link.label : undefined"
        :class="[
          'flex h-[34px] items-center rounded-md transition-colors',
          isActive(link.to) ? 'bg-hover text-ink' : 'text-ink-2 hover:bg-hover/60 hover:text-ink',
          collapsed ? 'justify-center' : 'gap-2.5 px-2.5 text-sm font-medium',
        ]"
        @click="emit('navigate')"
      >
        <AppIcon
          :name="link.icon"
          class="h-[18px] w-[18px]"
        />
        <span v-if="!collapsed">{{ link.label }}</span>
      </NuxtLink>
    </nav>

    <div :class="collapsed ? 'border-t border-line pt-3' : 'border-t border-line pt-4'">
      <div
        v-if="!collapsed"
        class="px-2.5 py-1 leading-tight"
      >
        <p class="truncate text-sm font-medium text-ink">{{ auth.user?.fullName ?? 'Signed out' }}</p>
        <p class="text-xs text-ink-3 capitalize">{{ auth.user?.role ?? 'guest' }}</p>
      </div>
      <button
        type="button"
        :disabled="signingOut"
        :aria-busy="signingOut"
        :title="collapsed ? 'Sign out' : undefined"
        :class="[
          'mt-1 flex h-[34px] w-full items-center rounded-md text-ink-2 transition-colors hover:bg-hover/60 hover:text-ink disabled:pointer-events-none disabled:opacity-50',
          collapsed ? 'justify-center' : 'gap-2.5 px-2.5 text-sm font-medium',
        ]"
        @click="onLogout"
      >
        <LoadingSpinner v-if="signingOut" />
        <AppIcon
          v-else
          name="logout"
          class="h-[18px] w-[18px]"
        />
        <span v-if="!collapsed">{{ signingOut ? 'Signing out…' : 'Sign out' }}</span>
      </button>
    </div>
  </div>
</template>

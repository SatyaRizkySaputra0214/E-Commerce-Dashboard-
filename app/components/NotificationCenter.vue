<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications';

const notifications = useNotificationsStore();

const icons = { success: 'check', error: 'alert', info: 'info' } as const;
</script>

<template>
  <div
    class="pointer-events-none fixed top-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2"
    aria-live="polite"
  >
    <div
      v-for="notification in notifications.notifications"
      :key="notification.id"
      class="pointer-events-auto flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3"
    >
      <AppIcon
        :name="icons[notification.type]"
        class="mt-0.5 h-[18px] w-[18px] text-ink-2"
      />
      <p class="flex-1 text-sm text-ink">{{ notification.message }}</p>
      <button
        type="button"
        class="-m-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-3 hover:bg-hover hover:text-ink"
        aria-label="Dismiss notification"
        @click="notifications.dismiss(notification.id)"
      >
        <AppIcon
          name="close"
          class="h-4 w-4"
        />
      </button>
    </div>
  </div>
</template>

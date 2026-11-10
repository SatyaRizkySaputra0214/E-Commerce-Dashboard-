<script setup lang="ts">
withDefaults(
  defineProps<{
    state: 'loading' | 'empty' | 'error';
    message?: string;
  }>(),
  { message: '' },
);

defineEmits<{ retry: [] }>();
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-line bg-surface">
    <div
      v-if="state === 'loading'"
      role="status"
      aria-live="polite"
    >
      <span class="sr-only">Loading…</span>
      <ul aria-hidden="true">
        <li
          v-for="row in 5"
          :key="row"
          class="flex h-12 items-center gap-4 border-b border-line px-4 last:border-b-0"
        >
          <span class="h-3 w-24 animate-pulse rounded bg-hover" />
          <span class="h-3 w-40 animate-pulse rounded bg-hover" />
          <span class="ml-auto h-3 w-20 animate-pulse rounded bg-hover" />
          <span class="h-6 w-20 animate-pulse rounded-full bg-hover" />
        </li>
      </ul>
    </div>

    <div
      v-else-if="state === 'empty'"
      class="px-4 py-12 text-center"
    >
      <p class="text-sm text-ink-2">{{ message || 'Nothing here yet.' }}</p>
    </div>

    <div
      v-else
      class="flex flex-col items-center gap-3 px-4 py-12 text-center"
    >
      <AppIcon
        name="alert"
        class="h-6 w-6 text-ink-2"
      />
      <p class="text-sm text-ink-2">{{ message || 'Something went wrong.' }}</p>
      <AppButton @click="$emit('retry')">
        <AppIcon
          name="retry"
          class="h-4 w-4"
        />
        Retry
      </AppButton>
    </div>
  </div>
</template>

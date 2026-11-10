<script lang="ts" setup>
import type { NuxtError } from 'nuxt/app';

const props = defineProps<{ error: NuxtError }>();

const message = computed(() => props.error.message || 'An unexpected error occurred.');

function handleError(): void {
  clearError({ redirect: '/' });
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-ground px-4">
    <div class="w-full max-w-sm rounded-xl border border-line bg-surface p-8 text-center">
      <p class="text-3xl font-semibold text-ink tabular-nums">{{ error.statusCode }}</p>
      <p class="mt-2 text-sm text-ink-2">{{ message }}</p>
      <button
        type="button"
        class="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-ink transition-colors hover:bg-ink"
        @click="handleError"
      >
        Back to the dashboard
      </button>
    </div>
  </div>
</template>

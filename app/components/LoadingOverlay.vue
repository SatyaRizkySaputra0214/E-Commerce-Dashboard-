<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';

defineProps<{
  label: string;
}>();
</script>

<template>
  <div
    class="absolute inset-0 z-10 flex items-start justify-center bg-surface/75 pt-16"
    role="status"
    aria-live="polite"
  >
    <span class="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium text-ink-2 shadow-sm">
      <LoadingSpinner size="md" />
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    type?: 'button' | 'submit';
    disabled?: boolean;
    loading?: boolean;
  }>(),
  { variant: 'secondary', type: 'button', disabled: false, loading: false },
);

const variantClasses = {
  primary: 'bg-primary text-primary-ink hover:bg-ink',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-hover',
  danger: 'border border-line-strong bg-surface text-cancelled-ink hover:bg-cancelled',
  ghost: 'text-ink-2 hover:bg-hover hover:text-ink',
} as const;
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="variantClasses[variant]"
    class="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50"
  >
    <LoadingSpinner v-if="loading" />
    <slot />
  </button>
</template>

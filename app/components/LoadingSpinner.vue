<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md';
  }>(),
  { size: 'sm' },
);
</script>

<template>
  <span
    aria-hidden="true"
    :class="[
      'inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none',
      size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
    ]"
  />
</template>

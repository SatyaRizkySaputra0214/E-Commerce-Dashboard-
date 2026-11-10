<script setup lang="ts">
import type { OrderStatus } from '#shared/types/api';

const props = defineProps<{ status: OrderStatus }>();

const classes: Record<OrderStatus, string> = {
  pending: 'bg-pending text-pending-ink',
  processing: 'bg-processing text-processing-ink',
  completed: 'bg-completed text-completed-ink',
  cancelled: 'bg-cancelled text-cancelled-ink',
};

const label = computed(() => props.status.charAt(0).toUpperCase() + props.status.slice(1));
</script>

<template>
  <span
    :class="classes[status]"
    class="inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium"
  >
    {{ label }}
  </span>
</template>

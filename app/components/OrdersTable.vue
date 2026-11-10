<script setup lang="ts">
import type { OrderListItem } from '#shared/types/api';
import { formatDateTimeWIB, formatIDR } from '#shared/utils/format';

defineProps<{
  orders: OrderListItem[];
}>();
</script>

<template>
  <div class="overflow-x-auto md:overflow-hidden rounded-lg border border-line bg-surface">
    <div class="flex h-10 items-center gap-4 border-b border-line px-4 text-xs font-medium tracking-wide text-ink-3 uppercase min-w-max">
      <span class="w-28 shrink-0">Order</span>
      <span class="min-w-0 flex-1">Customer</span>
      <span class="hidden w-44 shrink-0 md:inline">Date</span>
      <span class="w-28 shrink-0 text-right md:w-32">Total</span>
      <span class="w-28 shrink-0 text-right">Status</span>
      <span class="hidden w-6 shrink-0 md:inline"><span class="sr-only">View</span></span>
    </div>

    <ul class="min-w-max">
      <li
        v-for="order in orders"
        :key="order.id"
      >
        <NuxtLink
          :to="`/orders/${order.id}`"
          class="flex items-center gap-4 border-b border-line px-4 py-3 text-sm text-ink transition-colors last:border-b-0 hover:bg-hover md:h-12 md:py-0 min-w-max"
        >
          <span class="w-28 shrink-0 font-mono text-[13px] font-medium">{{ order.orderNumber }}</span>
          <span class="min-w-0 flex-1">
            <span class="block truncate font-medium">{{ order.customerName }}</span>
            <span class="mt-0.5 block text-xs text-ink-3 md:hidden">
              {{ formatDateTimeWIB(order.orderDate) }}
            </span>
          </span>
          <span class="hidden w-44 shrink-0 text-ink-2 md:inline">{{ formatDateTimeWIB(order.orderDate) }}</span>
          <span class="w-28 shrink-0 text-right font-medium tabular-nums md:w-32">{{ formatIDR(order.total) }}</span>
          <span class="flex w-28 shrink-0 justify-end">
            <StatusPill :status="order.status" />
          </span>
          <span class="hidden w-6 shrink-0 justify-end text-ink-3 md:flex">
            <AppIcon
              name="chevron-right"
              class="h-4 w-4"
            />
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

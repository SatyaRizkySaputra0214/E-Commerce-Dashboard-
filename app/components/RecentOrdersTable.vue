<script setup lang="ts">
import type { RecentOrder } from '#shared/types/api';
import { formatDateTimeWIB, formatIDR } from '#shared/utils/format';

defineProps<{ orders: RecentOrder[] }>();
</script>

<template>
  <div class="overflow-x-auto md:overflow-hidden rounded-lg border border-line bg-surface">
    <div class="flex h-10 items-center gap-4 border-b border-line px-4 text-xs font-medium tracking-wide text-ink-3 uppercase min-w-max">
      <span class="w-28 shrink-0">Order</span>
      <span class="min-w-0 flex-1">Customer</span>
      <span class="hidden w-44 shrink-0 md:inline">Date</span>
      <span class="w-28 shrink-0 text-right">Total</span>
      <span class="w-24 shrink-0 text-right">Status</span>
    </div>

    <ul class="min-w-max">
      <li
        v-for="order in orders"
        :key="order.id"
      >
        <NuxtLink
          :to="`/orders/${order.id}`"
          class="flex h-12 items-center gap-4 border-b border-line px-4 text-sm text-ink transition-colors last:border-b-0 hover:bg-hover min-w-max"
        >
          <span class="w-28 shrink-0 font-mono text-[13px]">{{ order.orderNumber }}</span>
          <span class="min-w-0 flex-1 truncate">{{ order.customerName }}</span>
          <span class="hidden w-44 shrink-0 text-ink-2 md:inline">{{ formatDateTimeWIB(order.orderDate) }}</span>
          <span class="w-28 shrink-0 text-right font-medium tabular-nums">{{ formatIDR(order.total) }}</span>
          <span class="flex w-24 shrink-0 justify-end">
            <StatusPill :status="order.status" />
          </span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { DashboardSummary } from '#shared/types/api';
import { formatIDR } from '#shared/utils/format';

defineProps<{ summary: DashboardSummary | null }>();
</script>

<template>
  <div class="grid grid-cols-2 gap-px rounded-lg border border-line bg-line lg:grid-cols-4">
    <div class="bg-surface p-5">
      <p class="text-xs font-medium tracking-wide text-ink-3 uppercase">Total Products</p>
      <p
        v-if="summary"
        class="mt-2 text-2xl font-semibold text-ink tabular-nums"
      >
        {{ summary.totalProducts }}
      </p>
      <div
        v-else
        class="mt-3.5 h-7 w-16 animate-pulse rounded bg-hover"
      />
    </div>

    <div class="bg-surface p-5">
      <p class="text-xs font-medium tracking-wide text-ink-3 uppercase">Total Orders</p>
      <p
        v-if="summary"
        class="mt-2 text-2xl font-semibold text-ink tabular-nums"
      >
        {{ summary.totalOrders }}
      </p>
      <div
        v-else
        class="mt-3.5 h-7 w-16 animate-pulse rounded bg-hover"
      />
    </div>

    <div class="col-span-2 bg-surface p-5 overflow-visible lg:col-span-1">
      <p class="text-xs font-medium tracking-wide text-ink-3 uppercase">Completed Order Value</p>
      <p
        v-if="summary"
        class="mt-1.5 text-[30px] leading-9 font-bold text-data tabular-nums whitespace-nowrap"
      >
        {{ formatIDR(summary.completedOrderValue) }}
      </p>
      <div
        v-else
        class="mt-3.5 h-8 w-32 animate-pulse rounded bg-hover"
      />
    </div>

    <div class="bg-surface p-5">
      <p class="text-xs font-medium tracking-wide text-ink-3 uppercase">Low Stock Products</p>
      <p
        v-if="summary"
        class="mt-2 text-2xl font-semibold text-ink tabular-nums"
      >
        {{ summary.lowStockProducts }}
      </p>
      <div
        v-else
        class="mt-3.5 h-7 w-16 animate-pulse rounded bg-hover"
      />
    </div>
  </div>
</template>

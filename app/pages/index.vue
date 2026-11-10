<script setup lang="ts">
import type { ApiSuccess, DashboardSummary, RecentOrder } from '#shared/types/api';

useHead({ title: 'Dashboard' });

const { data: summaryData, error: summaryError, refresh: refreshSummary } = await useFetch<ApiSuccess<DashboardSummary>>('/api/dashboard/summary');

const {
  data: recentData,
  pending: recentPending,
  error: recentError,
  refresh: refreshRecent,
} = await useFetch<ApiSuccess<RecentOrder[]>>('/api/dashboard/recent-orders');

const summary = computed(() => summaryData.value?.data ?? null);
const recentOrders = computed(() => recentData.value?.data ?? null);

const finding = computed(() => {
  const value = summary.value;
  if (!value) return 'Reading the numbers…';
  if (value.lowStockProducts > 0) {
    return `${value.lowStockProducts} of ${value.totalProducts} products are running low on stock.`;
  }
  return `All ${value.totalProducts} products are above the low-stock threshold.`;
});
</script>

<template>
  <div>
    <header class="mb-6">
      <h1 class="text-xl font-semibold tracking-tight">Dashboard</h1>
      <p class="mt-1 text-sm text-ink-2">{{ finding }}</p>
    </header>

    <DashboardKpis
      v-if="!summaryError"
      :summary="summary"
    />
    <StateBlock
      v-else
      state="error"
      message="Failed to load the dashboard summary. Please try again."
      @retry="refreshSummary()"
    />

    <section
      class="mt-8"
      aria-labelledby="recent-orders-heading"
    >
      <div class="mb-3 flex items-center justify-between gap-4">
        <h2
          id="recent-orders-heading"
          class="text-sm font-semibold tracking-wide text-ink-2 uppercase"
        >
          Recent Orders
        </h2>
        <NuxtLink
          to="/orders"
          class="text-sm font-medium text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          View all
        </NuxtLink>
      </div>

      <StateBlock
        v-if="recentPending && !recentOrders"
        state="loading"
      />
      <StateBlock
        v-else-if="recentError"
        state="error"
        message="Failed to load recent orders. Please try again."
        @retry="refreshRecent()"
      />
      <StateBlock
        v-else-if="recentOrders && recentOrders.length === 0"
        state="empty"
        message="No orders yet. Orders will appear here as they come in."
      />
      <RecentOrdersTable
        v-else-if="recentOrders"
        :orders="recentOrders"
      />
    </section>
  </div>
</template>

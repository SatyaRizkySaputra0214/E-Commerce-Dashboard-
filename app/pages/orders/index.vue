<script setup lang="ts">
import type { ApiSuccess, OrderListData, OrderStatus } from '#shared/types/api';
import Pagination from '@/components/Pagination.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

useHead({ title: 'Orders' });

type StatusFilterOption = 'all' | OrderStatus;

const searchInput = ref('');
const search = ref('');
const statusFilter = ref<StatusFilterOption>('all');

let searchTimer: ReturnType<typeof setTimeout> | undefined;

watch(searchInput, (value) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    search.value = value.trim();
  }, 300);
});

onUnmounted(() => {
  clearTimeout(searchTimer);
});

const filterOptions: { label: string; value: StatusFilterOption }[] = [
  { label: 'All status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const page = ref(1);
const limit = ref(10);

const queryParams = computed(() => {
  const params: Record<string, string> = {};
  if (search.value !== '') params.search = search.value;
  if (statusFilter.value !== 'all') params.status = statusFilter.value;
  params.page = page.value.toString();
  params.limit = limit.value.toString();
  return params;
});

const { data, pending, error, refresh } = await useFetch<ApiSuccess<OrderListData>>('/api/orders', {
  query: queryParams,
  watch: [search, statusFilter, page, limit],
});

const list = computed(() => data.value?.data ?? null);
const orders = computed(() => list.value?.orders ?? []);
const total = computed(() => list.value?.total ?? 0);
const totalPages = computed(() => list.value?.totalPages ?? Math.ceil(total.value / limit.value));
const isFiltered = computed(() => search.value !== '' || statusFilter.value !== 'all');

function resetFilters(): void {
  searchInput.value = '';
  search.value = '';
  statusFilter.value = 'all';
  page.value = 1;
}

function handlePageChange(newPage: number): void {
  page.value = newPage;
}
</script>

<template>
  <div>
    <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Orders</h1>
        <p class="mt-1 text-sm text-ink-2">Incoming orders and fulfilment status.</p>
      </div>
    </header>

    <div class="mb-3 flex flex-wrap items-center gap-2 sm:gap-3">
      <div class="relative w-full sm:w-72">
        <AppIcon
          name="search"
          class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-3"
        />
        <input
          v-model="searchInput"
          type="search"
          placeholder="Search orders…"
          aria-label="Search orders by order number, customer name, or email"
          class="h-10 w-full rounded-md border border-line-strong bg-surface pr-3 pl-9 text-sm text-ink transition-colors placeholder:text-ink-3 focus:border-ink focus:outline-none"
        />
      </div>
      <select
        v-model="statusFilter"
        aria-label="Filter by status"
        class="h-10 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink transition-colors focus:border-ink focus:outline-none sm:w-48"
      >
        <option
          v-for="option in filterOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div
        v-if="isFiltered"
        class="flex items-center gap-2 sm:ml-auto"
      >
        <p class="text-xs text-ink-3">{{ orders.length }} of {{ total }} orders</p>
        <button
          type="button"
          class="rounded text-xs text-ink-3 underline transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- State handlers -->
    <StateBlock
      v-if="pending && !data"
      state="loading"
    />
    <StateBlock
      v-else-if="error"
      state="error"
      message="Failed to load orders. Please try again."
      @retry="refresh()"
    />
    <div
      v-else-if="orders.length === 0"
      class="flex flex-col items-center gap-3 overflow-hidden rounded-lg border border-line bg-surface px-4 py-12 text-center"
    >
      <p class="text-sm text-ink-2">
        {{ isFiltered ? 'No orders found. Try changing your search or filter.' : 'No orders recorded yet.' }}
      </p>
      <AppButton
        v-if="isFiltered"
        @click="resetFilters"
      >
        Reset filters
      </AppButton>
    </div>
    <div
      v-else
      class="relative min-h-48"
    >
      <LoadingOverlay
        v-if="pending"
        label="Loading orders…"
      />
      <OrdersTable :orders="orders" />
      <Pagination
        v-if="total > limit"
        :total="total"
        :page="page"
        :limit="limit"
        :total-pages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
</template>

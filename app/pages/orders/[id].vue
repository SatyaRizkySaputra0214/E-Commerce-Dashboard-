<script setup lang="ts">
import type { ApiSuccess, OrderDetail, OrderStatus } from '#shared/types/api';
import { formatDateTimeWIB, formatIDR } from '#shared/utils/format';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import { getApiFailure } from '@/utils/api';
import Pagination from '@/components/Pagination.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const route = useRoute();
const auth = useAuthStore();
const notifications = useNotificationsStore();

const orderId = computed(() => (Array.isArray(route.params.id) ? route.params.id[0] : route.params.id));

const itemsPage = ref(1);
const itemsLimit = ref(10);

const { data, pending, error, refresh } = await useFetch<ApiSuccess<OrderDetail>>(() => `/api/orders/${orderId.value}?itemsPage=${itemsPage.value}&itemsLimit=${itemsLimit.value}`, {
  watch: [orderId, itemsPage, itemsLimit],
});

const order = computed(() => data.value?.data ?? null);
const isNotFound = computed(() => error.value?.statusCode === 404);

useHead({
  title: computed(() => (order.value ? `Order ${order.value.orderNumber}` : 'Order detail')),
});

const statusOptions: { label: string; value: OrderStatus }[] = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const updatingStatus = ref(false);

async function setStatus(newStatus: OrderStatus): Promise<void> {
  if (!order.value || updatingStatus.value || order.value.status === newStatus) return;

  updatingStatus.value = true;
  try {
    const response = await $fetch<ApiSuccess<{ id: number; status: OrderStatus }>>(`/api/orders/${order.value.id}/status`, {
      method: 'PATCH',
      body: { status: newStatus },
    });
    notifications.success(response.message);
    await refresh();
  } catch (err) {
    const failure = getApiFailure(err);
    notifications.error(failure?.message ?? 'Failed to update order status. Please try again.');
  } finally {
    updatingStatus.value = false;
  }
}

const totalItemsCount = computed(() => {
  if (!order.value) return 0;
  return order.value.items.reduce((sum, item) => sum + item.quantity, 0);
});
</script>

<template>
  <div>
    <!-- Back to orders navigation -->
    <div class="mb-4">
      <NuxtLink
        to="/orders"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        <AppIcon
          name="chevron-left"
          class="h-4 w-4"
        />
        Back to orders
      </NuxtLink>
    </div>

    <!-- State handlers -->
    <StateBlock
      v-if="pending && !order"
      state="loading"
    />

    <div
      v-else-if="isNotFound"
      class="flex flex-col items-center gap-3 overflow-hidden rounded-lg border border-line bg-surface px-4 py-12 text-center"
    >
      <AppIcon
        name="info"
        class="h-8 w-8 text-ink-3"
      />
      <div>
        <h2 class="text-base font-semibold text-ink">Order not found</h2>
        <p class="mt-1 text-sm text-ink-2">The requested order does not exist or has been removed.</p>
      </div>
      <NuxtLink
        to="/orders"
        class="mt-2 inline-flex h-9 items-center justify-center rounded-md border border-line-strong bg-surface px-4 text-xs font-medium text-ink hover:bg-hover"
      >
        Return to orders
      </NuxtLink>
    </div>

    <StateBlock
      v-else-if="error"
      state="error"
      message="Failed to load order details. Please try again."
      @retry="refresh()"
    />

    <div
      v-else-if="order"
      class="relative space-y-6"
    >
      <LoadingOverlay
        v-if="pending"
        label="Loading order details…"
      />
      <!-- Header -->
      <header class="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="font-mono text-2xl font-semibold tracking-tight text-ink">{{ order.orderNumber }}</h1>
            <StatusPill :status="order.status" />
          </div>
          <p class="mt-1 text-xs text-ink-2">Placed on {{ formatDateTimeWIB(order.orderDate) }}</p>
        </div>

        <!-- Admin Order Status Controls -->
        <div
          v-if="auth.isAdmin"
          class="flex flex-col items-start gap-1.5 sm:items-end"
        >
          <span class="text-xs font-medium tracking-wide text-ink-3 uppercase">Update status</span>
          <div
            class="inline-flex rounded-lg border border-line bg-surface p-1 shadow-xs"
            role="group"
            aria-label="Update order status"
          >
            <button
              v-for="opt in statusOptions"
              :key="opt.value"
              type="button"
              :disabled="updatingStatus"
              :class="[
                'inline-flex h-8 items-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50',
                order.status === opt.value ? 'bg-primary text-primary-ink shadow-xs' : 'text-ink-2 hover:bg-hover hover:text-ink',
              ]"
              :aria-pressed="order.status === opt.value"
              @click="setStatus(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
          <p
            v-if="updatingStatus"
            class="mt-2 inline-flex items-center gap-2 text-xs text-ink-2"
            role="status"
            aria-live="polite"
          >
            <LoadingSpinner />
            Updating order status…
          </p>
        </div>
      </header>

      <!-- Customer & Order Meta Information -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg border border-line bg-surface p-4">
          <span class="text-xs font-medium tracking-wide text-ink-3 uppercase">Customer</span>
          <p class="mt-1 font-medium text-ink">{{ order.customerName }}</p>
          <p class="text-xs text-ink-2">{{ order.customerEmail }}</p>
        </div>

        <div class="rounded-lg border border-line bg-surface p-4">
          <span class="text-xs font-medium tracking-wide text-ink-3 uppercase">Order summary</span>
          <p class="mt-1 text-sm text-ink">{{ totalItemsCount }} {{ totalItemsCount === 1 ? 'item' : 'items' }}</p>
          <p class="text-xs text-ink-2">{{ order.items.length }} unique line {{ order.items.length === 1 ? 'item' : 'items' }}</p>
        </div>

        <div class="rounded-lg border border-line bg-surface p-4 sm:col-span-2 lg:col-span-1">
          <span class="text-xs font-medium tracking-wide text-ink-3 uppercase">Total amount</span>
          <p class="mt-1 font-mono text-xl font-semibold text-ink tabular-nums">
            {{ formatIDR(order.total) }}
          </p>
          <p class="text-xs text-ink-2">All prices in IDR</p>
        </div>
      </section>

      <!-- Items Table -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold tracking-tight text-ink">Ordered products</h2>
          <span class="text-xs text-ink-3">{{ order.items.length }} line {{ order.items.length === 1 ? 'item' : 'items' }}</span>
        </div>

        <div class="overflow-x-auto md:overflow-hidden rounded-lg border border-line bg-surface">
          <!-- Table Header -->
          <div class="flex h-10 items-center gap-4 border-b border-line px-4 text-xs font-medium tracking-wide text-ink-3 uppercase min-w-max">
            <span class="min-w-0 flex-1">Product name</span>
            <span class="w-20 shrink-0 text-center md:w-24">Quantity</span>
            <span class="hidden w-32 shrink-0 text-right sm:inline">Unit price</span>
            <span class="w-28 shrink-0 text-right md:w-32">Subtotal</span>
          </div>

          <!-- Items list -->
          <ul class="min-w-max">
            <li
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center gap-4 border-b border-line px-4 py-3 text-sm text-ink last:border-b-0 md:h-12 md:py-0 min-w-max"
            >
              <div class="min-w-0 flex-1">
                <span class="block truncate font-medium text-ink">{{ item.productName }}</span>
                <span class="mt-0.5 block text-xs text-ink-3 sm:hidden"> {{ item.quantity }} × {{ formatIDR(item.unitPrice) }} </span>
              </div>
              <span class="w-20 shrink-0 text-center text-ink tabular-nums md:w-24">
                {{ item.quantity }}
              </span>
              <span class="hidden w-32 shrink-0 text-right text-ink-2 tabular-nums sm:inline">
                {{ formatIDR(item.unitPrice) }}
              </span>
              <span class="w-28 shrink-0 text-right font-medium text-ink tabular-nums md:w-32">
                {{ formatIDR(item.subtotal) }}
              </span>
            </li>
          </ul>

          <!-- Summary footer -->
          <div class="flex items-center justify-between border-t border-line bg-ground/50 px-4 py-3 min-w-max">
            <span class="text-xs font-medium text-ink-2">Total</span>
            <span class="font-mono text-base font-semibold text-ink tabular-nums">
              {{ formatIDR(order.total) }}
            </span>
          </div>
        </div>
        <Pagination
          v-if="order.itemsTotal && order.itemsTotal > itemsLimit"
          :total="order.itemsTotal"
          :page="itemsPage"
          :limit="itemsLimit"
          :total-pages="order.itemsTotalPages ?? Math.ceil(order.itemsTotal / itemsLimit)"
          @page-change="(newPage) => { itemsPage = newPage; }"
        />
      </section>
    </div>
  </div>
</template>

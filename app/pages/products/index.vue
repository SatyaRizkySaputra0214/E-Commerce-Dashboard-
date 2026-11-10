<script setup lang="ts">
import type { ApiSuccess, Product, ProductListData } from '#shared/types/api';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import { getApiFailure } from '@/utils/api';
import Pagination from '@/components/Pagination.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

useHead({ title: 'Products' });

const auth = useAuthStore();
const notifications = useNotificationsStore();

const searchInput = ref('');
const search = ref('');
const category = ref('');
const page = ref(1);
const limit = ref(10);

let searchTimer: ReturnType<typeof setTimeout> | undefined;

watch(searchInput, (value) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    search.value = value.trim();
    page.value = 1;
  }, 300);
});

watch([category, limit], () => {
  page.value = 1;
});

onUnmounted(() => {
  clearTimeout(searchTimer);
});

const { data, pending, error, refresh } = await useFetch<ApiSuccess<ProductListData>>('/api/products', {
  query: { search, category, page, limit },
  watch: [search, category, page, limit],
});

const list = computed(() => data.value?.data ?? null);
const products = computed(() => list.value?.products ?? []);
const categories = computed(() => list.value?.categories ?? []);
const total = computed(() => list.value?.total ?? 0);
const totalPages = computed(() => list.value?.totalPages ?? Math.ceil(total.value / limit.value));
const isFiltered = computed(() => search.value !== '' || category.value !== '');

const formOpen = ref(false);
const editingProduct = ref<Product | null>(null);
const deleteTarget = ref<Product | null>(null);
const deleting = ref(false);

const deleteMessage = computed(() =>
  deleteTarget.value === null ? '' : `Are you sure you want to delete “${deleteTarget.value.name}”? This action cannot be undone.`,
);

function openCreate(): void {
  editingProduct.value = null;
  formOpen.value = true;
}

function openEdit(product: Product): void {
  editingProduct.value = product;
  formOpen.value = true;
}

function requestDelete(product: Product): void {
  deleteTarget.value = product;
}

async function confirmDelete(): Promise<void> {
  const product = deleteTarget.value;
  if (product === null || deleting.value) return;
  deleting.value = true;
  try {
    const response = await $fetch<ApiSuccess<{ id: number }>>(`/api/products/${product.id}`, { method: 'DELETE' });
    notifications.success(response.message);
    deleteTarget.value = null;
    await refresh();
  } catch (error) {
    const failure = getApiFailure(error);
    notifications.error(failure?.message ?? 'Failed to delete product. Please try again.');
  } finally {
    deleting.value = false;
  }
}

async function onSaved(): Promise<void> {
  formOpen.value = false;
  await refresh();
}

function resetFilters(): void {
  searchInput.value = '';
  search.value = '';
  category.value = '';
}
</script>

<template>
  <div>
    <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Products</h1>
        <p class="mt-1 text-sm text-ink-2">Catalogue overview and management.</p>
      </div>
      <AppButton
        v-if="auth.isAdmin"
        variant="primary"
        @click="openCreate"
      >
        <AppIcon
          name="plus"
          class="h-4 w-4"
        />
        Add product
      </AppButton>
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
          placeholder="Search products…"
          aria-label="Search products by name"
          class="h-10 w-full rounded-md border border-line-strong bg-surface pr-3 pl-9 text-sm text-ink transition-colors placeholder:text-ink-3 focus:border-ink focus:outline-none"
        />
      </div>
      <select
        v-model="category"
        aria-label="Filter by category"
        class="h-10 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink transition-colors focus:border-ink focus:outline-none sm:w-48"
      >
        <option value="">All categories</option>
        <option
          v-for="option in categories"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <div
        v-if="isFiltered"
        class="flex items-center gap-2 sm:ml-auto"
      >
        <p class="text-xs text-ink-3">{{ products.length }} of {{ total }} products</p>
        <button
          type="button"
          class="rounded text-xs text-ink-3 underline transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>
    </div>

    <StateBlock
      v-if="pending && !list"
      state="loading"
    />
    <StateBlock
      v-else-if="error"
      state="error"
      message="Failed to load products. Please try again."
      @retry="refresh()"
    />
    <div
      v-else-if="list !== null && products.length === 0"
      class="flex flex-col items-center gap-3 overflow-hidden rounded-lg border border-line bg-surface px-4 py-12 text-center"
    >
      <p class="text-sm text-ink-2">
        {{ isFiltered ? 'No products found. Try changing your search or filter.' : 'No products yet. Products will appear here as they are added.' }}
      </p>
      <AppButton
        v-if="isFiltered"
        @click="resetFilters"
      >
        Reset filters
      </AppButton>
    </div>
    <div
      v-else-if="list !== null"
      class="relative min-h-48"
    >
      <LoadingOverlay
        v-if="pending"
        label="Loading products…"
      />
      <ProductsTable
        :products="products"
        :is-admin="auth.isAdmin"
        @edit="openEdit"
        @delete="requestDelete"
      />
      <Pagination
        v-if="total > limit"
        :total="total"
        :page="page"
        :limit="limit"
        :total-pages="totalPages"
        @page-change="(newPage) => { page = newPage; }"
      />
    </div>

    <ProductFormModal
      :open="formOpen"
      :product="editingProduct"
      :categories="categories"
      @close="formOpen = false"
      @saved="onSaved"
    />
    <ConfirmDialog
      :open="deleteTarget !== null"
      title="Delete product"
      :message="deleteMessage"
      confirm-label="Delete"
      :busy="deleting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

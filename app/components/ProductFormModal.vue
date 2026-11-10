<script setup lang="ts">
import type { ApiSuccess, Product } from '#shared/types/api';
import { useNotificationsStore } from '@/stores/notifications';

const props = defineProps<{
  open: boolean;
  product: Product | null;
  categories: string[];
}>();

const emit = defineEmits<{ close: []; saved: [] }>();

const notifications = useNotificationsStore();

const name = ref('');
const category = ref('');
const price = ref('');
const stock = ref('');
const fieldErrors = ref<{ name?: string; category?: string; price?: string; stock?: string }>({});
const formError = ref('');
const submitting = ref(false);

watch(
  [() => props.open, () => props.product],
  ([open, product]) => {
    if (!open) return;
    fieldErrors.value = {};
    formError.value = '';
    name.value = product?.name ?? '';
    category.value = product?.category ?? '';
    price.value = product !== null && product !== undefined ? String(product.price) : '';
    stock.value = product !== null && product !== undefined ? String(product.stock) : '';
  },
  { immediate: true },
);

function validate(): { name?: string; category?: string; price?: string; stock?: string } {
  const errors: { name?: string; category?: string; price?: string; stock?: string } = {};
  const trimmedName = name.value.trim();
  const trimmedCategory = category.value.trim();
  const trimmedPrice = price.value.trim();
  const trimmedStock = stock.value.trim();

  if (!trimmedName) errors.name = 'Product name is required.';
  else if (trimmedName.length > 255) errors.name = 'Product name must be 255 characters or fewer.';

  if (!trimmedCategory) errors.category = 'Category is required.';
  else if (trimmedCategory.length > 255) errors.category = 'Category must be 255 characters or fewer.';

  if (trimmedPrice === '') errors.price = 'Price is required.';
  else {
    const parsedPrice = Number(trimmedPrice);
    if (!Number.isFinite(parsedPrice)) errors.price = 'Price must be a number.';
    else if (parsedPrice <= 0) errors.price = 'Price must be greater than zero.';
    else if (parsedPrice > 9999999999.99) errors.price = 'Price must be 9999999999.99 or less.';
  }

  if (trimmedStock === '') errors.stock = 'Stock is required.';
  else {
    const parsedStock = Number(trimmedStock);
    if (!Number.isFinite(parsedStock) || !Number.isInteger(parsedStock)) errors.stock = 'Stock must be a whole number.';
    else if (parsedStock < 0) errors.stock = 'Stock cannot be negative.';
    else if (parsedStock > 2147483647) errors.stock = 'Stock must be 2147483647 or less.';
  }

  return errors;
}

async function onSubmit(): Promise<void> {
  if (submitting.value) return;
  formError.value = '';
  const errors = validate();
  fieldErrors.value = errors;
  if (Object.keys(errors).length > 0) return;

  submitting.value = true;
  try {
    const product = props.product;
    const response = await $fetch<ApiSuccess<Product>>(product === null ? '/api/products' : `/api/products/${product.id}`, {
      method: product === null ? 'POST' : 'PUT',
      body: {
        name: name.value.trim(),
        category: category.value.trim(),
        price: Number(price.value.trim()),
        stock: Number(stock.value.trim()),
      },
    });
    notifications.success(response.message);
    emit('saved');
    emit('close');
  } catch (error) {
    const failure = getApiFailure(error);
    if (failure?.errors) fieldErrors.value = failure.errors;
    formError.value =
      failure?.message ?? (props.product === null ? 'Failed to create product. Please try again.' : 'Failed to update product. Please try again.');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <AppModal
    :open="open"
    :title="product === null ? 'Add product' : 'Edit product'"
    @close="emit('close')"
  >
    <form
      class="p-4 sm:p-6"
      novalidate
      @submit.prevent="onSubmit"
    >
      <div
        v-if="formError"
        class="mb-5 flex items-start gap-2.5 rounded-md bg-cancelled px-3 py-2.5 text-sm text-cancelled-ink"
        role="alert"
      >
        <AppIcon
          name="alert"
          class="mt-0.5 h-4 w-4 shrink-0"
        />
        <p>{{ formError }}</p>
      </div>

      <div class="space-y-4">
        <div>
          <label
            for="product-name"
            class="mb-1.5 block text-xs font-medium text-ink-2"
            >Product name</label
          >
          <input
            id="product-name"
            v-model="name"
            data-autofocus
            type="text"
            name="name"
            required
            autocomplete="off"
            placeholder="e.g. Toba Coffee Beans 250g"
            :class="fieldErrors.name ? 'border-cancelled-ink focus:border-cancelled-ink' : 'border-line-strong focus:border-ink'"
            class="h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink transition-colors placeholder:text-ink-3 focus:outline-none"
            :aria-invalid="fieldErrors.name ? 'true' : undefined"
            :aria-describedby="fieldErrors.name ? 'product-name-error' : undefined"
          />
          <p
            v-if="fieldErrors.name"
            id="product-name-error"
            class="mt-1.5 text-xs text-cancelled-ink"
          >
            {{ fieldErrors.name }}
          </p>
        </div>

        <div>
          <label
            for="product-category"
            class="mb-1.5 block text-xs font-medium text-ink-2"
            >Category</label
          >
          <input
            id="product-category"
            v-model="category"
            type="text"
            name="category"
            required
            list="product-categories"
            autocomplete="off"
            placeholder="e.g. Coffee"
            :class="fieldErrors.category ? 'border-cancelled-ink focus:border-cancelled-ink' : 'border-line-strong focus:border-ink'"
            class="h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink transition-colors placeholder:text-ink-3 focus:outline-none"
            :aria-invalid="fieldErrors.category ? 'true' : undefined"
            :aria-describedby="fieldErrors.category ? 'product-category-error' : undefined"
          />
          <datalist id="product-categories">
            <option
              v-for="option in categories"
              :key="option"
              :value="option"
            />
          </datalist>
          <p
            v-if="fieldErrors.category"
            id="product-category-error"
            class="mt-1.5 text-xs text-cancelled-ink"
          >
            {{ fieldErrors.category }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="product-price"
              class="mb-1.5 block text-xs font-medium text-ink-2"
              >Price (Rp)</label
            >
            <input
              id="product-price"
              v-model="price"
              type="text"
              inputmode="decimal"
              name="price"
              required
              autocomplete="off"
              placeholder="e.g. 250000"
              :class="fieldErrors.price ? 'border-cancelled-ink focus:border-cancelled-ink' : 'border-line-strong focus:border-ink'"
              class="h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink transition-colors placeholder:text-ink-3 focus:outline-none"
              :aria-invalid="fieldErrors.price ? 'true' : undefined"
              :aria-describedby="fieldErrors.price ? 'product-price-error' : undefined"
            />
            <p
              v-if="fieldErrors.price"
              id="product-price-error"
              class="mt-1.5 text-xs text-cancelled-ink"
            >
              {{ fieldErrors.price }}
            </p>
          </div>

          <div>
            <label
              for="product-stock"
              class="mb-1.5 block text-xs font-medium text-ink-2"
              >Stock</label
            >
            <input
              id="product-stock"
              v-model="stock"
              type="text"
              inputmode="numeric"
              name="stock"
              required
              autocomplete="off"
              placeholder="e.g. 24"
              :class="fieldErrors.stock ? 'border-cancelled-ink focus:border-cancelled-ink' : 'border-line-strong focus:border-ink'"
              class="h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink transition-colors placeholder:text-ink-3 focus:outline-none"
              :aria-invalid="fieldErrors.stock ? 'true' : undefined"
              :aria-describedby="fieldErrors.stock ? 'product-stock-error' : undefined"
            />
            <p
              v-if="fieldErrors.stock"
              id="product-stock-error"
              class="mt-1.5 text-xs text-cancelled-ink"
            >
              {{ fieldErrors.stock }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <AppButton
          :disabled="submitting"
          @click="emit('close')"
        >
          Cancel
        </AppButton>
        <AppButton
          type="submit"
          variant="primary"
          :disabled="submitting"
          :loading="submitting"
          :aria-busy="submitting"
        >
          {{ submitting ? 'Saving…' : product === null ? 'Create product' : 'Save changes' }}
        </AppButton>
      </div>
    </form>
  </AppModal>
</template>

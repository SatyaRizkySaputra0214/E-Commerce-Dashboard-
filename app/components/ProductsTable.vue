<script setup lang="ts">
import type { Product } from '#shared/types/api';
import { formatIDR } from '#shared/utils/format';

defineProps<{
  products: Product[];
  isAdmin: boolean;
}>();

defineEmits<{ edit: [product: Product]; delete: [product: Product] }>();
</script>

<template>
  <div class="overflow-x-auto md:overflow-hidden rounded-lg border border-line bg-surface">
    <div class="flex h-10 items-center gap-4 border-b border-line px-4 text-xs font-medium tracking-wide text-ink-3 uppercase min-w-max">
      <span class="min-w-0 flex-1">Product</span>
      <span class="hidden w-40 shrink-0 md:inline">Category</span>
      <span class="w-28 shrink-0 text-right md:w-32">Price</span>
      <span class="hidden w-24 shrink-0 text-right md:inline">Stock</span>
      <span
        v-if="isAdmin"
        class="w-[92px] shrink-0 md:w-[68px]"
      >
        <span class="sr-only">Actions</span>
      </span>
    </div>

    <ul class="min-w-max">
      <li
        v-for="product in products"
        :key="product.id"
      >
        <div class="flex items-center gap-4 border-b border-line px-4 py-3 text-sm text-ink last:border-b-0 md:h-12 md:py-0 min-w-max">
          <span class="min-w-0 flex-1">
            <span class="block truncate font-medium">{{ product.name }}</span>
            <span class="mt-0.5 block text-xs text-ink-3 md:hidden"
              >{{ product.category }} · <span :class="product.stock < 5 ? 'font-medium text-pending-ink' : undefined">{{ product.stock }} in stock</span></span
            >
          </span>
          <span class="hidden w-40 shrink-0 truncate text-ink-2 md:inline">{{ product.category }}</span>
          <span class="w-28 shrink-0 text-right font-medium tabular-nums md:w-32">{{ formatIDR(product.price) }}</span>
          <span
            class="hidden w-24 shrink-0 text-right tabular-nums md:inline"
            :class="product.stock < 5 ? 'text-pending-ink' : 'text-ink-2'"
          >
            {{ product.stock }}
          </span>
          <span
            v-if="isAdmin"
            class="flex w-[92px] shrink-0 items-center justify-end gap-1 md:w-[68px]"
          >
            <button
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:h-8 md:w-8"
              :aria-label="`Edit ${product.name}`"
              @click="$emit('edit', product)"
            >
              <AppIcon
                name="edit"
                class="h-4 w-4"
              />
            </button>
            <button
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-cancelled hover:text-cancelled-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink md:h-8 md:w-8"
              :aria-label="`Delete ${product.name}`"
              @click="$emit('delete', product)"
            >
              <AppIcon
                name="delete"
                class="h-4 w-4"
              />
            </button>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

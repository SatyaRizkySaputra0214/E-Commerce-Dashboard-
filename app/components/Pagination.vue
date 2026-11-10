<script setup lang="ts">
interface Props {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

function goToPage(newPage: number): void {
  if (newPage < 1 || newPage > props.totalPages || newPage === props.page) return;
  emit('page-change', newPage);
}

function getPageNumbers(): (number | string)[] {
  const pages: (number | string)[] = [];
  const current = props.page;
  const last = props.totalPages;

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    
    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    
    for (let i = start; i <= end; i++) pages.push(i);
    
    if (current < last - 2) pages.push('...');
    pages.push(last);
  }
  
  return pages;
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-1 mt-6"
    aria-label="Pagination"
  >
    <button
      type="button"
      :disabled="page <= 1"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-surface text-sm font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink disabled:pointer-events-none disabled:opacity-50"
      aria-label="Go to first page"
      @click="goToPage(1)"
    >
      <AppIcon name="chevron-left-double" class="h-4 w-4" />
    </button>

    <button
      type="button"
      :disabled="page <= 1"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-surface text-sm font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink disabled:pointer-events-none disabled:opacity-50"
      aria-label="Go to previous page"
      @click="goToPage(page - 1)"
    >
      <AppIcon name="chevron-left" class="h-4 w-4" />
    </button>

    <template v-for="(p, index) in getPageNumbers()">
      <button
        v-if="typeof p === 'number'"
        type="button"
        :key="`page-${p}`"
        :aria-current="p === page ? 'page' : undefined"
        :class="[
          'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-line-strong px-3 text-sm font-medium transition-colors',
          p === page 
            ? 'bg-primary text-primary-ink border-primary' 
            : 'bg-surface text-ink-2 hover:bg-hover hover:text-ink',
        ]"
        @click="goToPage(p)"
      >
        {{ p }}
      </button>
      <span
        v-else
        :key="`ellipsis-${index}`"
        class="inline-flex h-9 min-w-9 items-center justify-center px-3 text-sm font-medium text-ink-3"
      >
        {{ p }}
      </span>
    </template>

    <button
      type="button"
      :disabled="page >= totalPages"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-surface text-sm font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink disabled:pointer-events-none disabled:opacity-50"
      aria-label="Go to next page"
      @click="goToPage(page + 1)"
    >
      <AppIcon name="chevron-right" class="h-4 w-4" />
    </button>

    <button
      type="button"
      :disabled="page >= totalPages"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-strong bg-surface text-sm font-medium text-ink-2 transition-colors hover:bg-hover hover:text-ink disabled:pointer-events-none disabled:opacity-50"
      aria-label="Go to last page"
      @click="goToPage(totalPages)"
    >
      <AppIcon name="chevron-right-double" class="h-4 w-4" />
    </button>
  </nav>
</template>

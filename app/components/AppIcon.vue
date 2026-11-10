<script setup lang="ts">
defineProps<{
  name:
    | 'dashboard'
    | 'products'
    | 'orders'
    | 'logout'
    | 'menu'
    | 'close'
    | 'check'
    | 'alert'
    | 'info'
    | 'retry'
    | 'search'
    | 'plus'
    | 'edit'
    | 'delete'
    | 'chevron-left'
    | 'chevron-right'
    | 'chevron-left-double'
    | 'chevron-right-double';
}>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="h-5 w-5 shrink-0"
  >
    <template v-if="name === 'dashboard'">
      <rect
        x="3.5"
        y="3.5"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="13.5"
        y="3.5"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="3.5"
        y="13.5"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="13.5"
        y="13.5"
        width="7"
        height="7"
        rx="1.5"
      />
    </template>
    <template v-else-if="name === 'products'">
      <path d="M3.3 7.9a2 2 0 0 1 1-1.6l7-3.5a2 2 0 0 1 2 0l7 3.5a2 2 0 0 1 1 1.6" />
      <path d="M3 8.5v7a2 2 0 0 0 1 1.73l7 3.5a2 2 0 0 0 2 0l7-3.5a2 2 0 0 0 1-1.73v-7" />
      <path d="M3.3 7.9 12 12.5l8.7-4.6" />
      <path d="M12 12.5V21" />
    </template>
    <template v-else-if="name === 'orders'">
      <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12h5" />
    </template>
    <template v-else-if="name === 'logout'">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </template>
    <template v-else-if="name === 'close'">
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </template>
    <template v-else-if="name === 'check'">
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="m8.5 12.5 2.5 2.5 5-6" />
    </template>
    <template v-else-if="name === 'alert'">
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 7.5v5" />
      <path d="M12 16.5h.01" />
    </template>
    <template v-else-if="name === 'info'">
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 11v5" />
      <path d="M12 7.5h.01" />
    </template>
    <template v-else-if="name === 'chevron-left'">
      <path d="m15 5-7 7 7 7" />
    </template>
    <template v-else-if="name === 'chevron-right'">
      <path d="m9 5 7 7-7 7" />
    </template>
    <template v-else-if="name === 'chevron-left-double'">
      <path d="m19 5-7 7 7 7" />
      <path d="m13 5-7 7 7 7" />
    </template>
    <template v-else-if="name === 'chevron-right-double'">
      <path d="m5 5 7 7-7 7" />
      <path d="m11 5 7 7-7 7" />
    </template>
    <template v-else-if="name === 'retry'">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </template>
    <template v-else-if="name === 'search'">
      <circle
        cx="11"
        cy="11"
        r="7"
      />
      <path d="m21 21-4.3-4.3" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </template>
    <template v-else-if="name === 'edit'">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </template>
    <template v-else-if="name === 'delete'">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </template>
  </svg>
</template>

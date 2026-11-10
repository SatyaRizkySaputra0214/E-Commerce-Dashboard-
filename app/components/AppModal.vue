<script setup lang="ts">
const props = defineProps<{
  open: boolean;
  title: string;
}>();

const emit = defineEmits<{ close: [] }>();

const panel = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    emit('close');
    return;
  }
  if (event.key === 'Tab') {
    const focusable = panel.value?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
}

function activate(): void {
  window.addEventListener('keydown', onKeyDown);
  document.body.style.overflow = 'hidden';
  previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  nextTick(() => {
    const target = panel.value?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.value;
    target?.focus();
  });
}

function deactivate(): void {
  window.removeEventListener('keydown', onKeyDown);
  document.body.style.overflow = '';
  previouslyFocused?.focus();
  previouslyFocused = null;
}

watch(
  () => props.open,
  (open) => {
    if (typeof window === 'undefined') return;
    if (open) activate();
    else deactivate();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') deactivate();
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[45] flex items-end justify-center sm:items-center sm:p-4"
      >
        <div
          class="absolute inset-0 bg-ink/20"
          aria-hidden="true"
          @click="emit('close')"
        />
        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          class="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-xl border border-line bg-surface shadow-lg sm:max-w-md sm:rounded-xl"
        >
          <header class="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line px-4">
            <h2 class="truncate text-sm font-semibold tracking-tight">{{ title }}</h2>
            <button
              type="button"
              class="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              aria-label="Close dialog"
              @click="emit('close')"
            >
              <AppIcon
                name="close"
                class="h-5 w-5"
              />
            </button>
          </header>
          <div class="min-h-0 flex-1 overflow-y-auto">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

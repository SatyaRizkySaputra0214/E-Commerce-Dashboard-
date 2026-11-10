<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    busy?: boolean;
  }>(),
  { confirmLabel: 'Confirm', busy: false },
);

defineEmits<{ cancel: []; confirm: [] }>();
</script>

<template>
  <AppModal
    :open="open"
    :title="title"
    @close="$emit('cancel')"
  >
    <div class="p-4 sm:p-6">
      <p class="text-sm leading-relaxed text-ink-2">{{ message }}</p>
      <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <AppButton
          data-autofocus
          :disabled="busy"
          @click="$emit('cancel')"
        >
          Cancel
        </AppButton>
        <AppButton
          variant="danger"
          :disabled="busy"
          :loading="busy"
          :aria-busy="busy"
          @click="$emit('confirm')"
        >
          {{ busy ? `${confirmLabel}…` : confirmLabel }}
        </AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';

definePageMeta({ layout: 'auth' });

useHead({ title: 'Log in' });

const auth = useAuthStore();
const notifications = useNotificationsStore();

const email = ref('');
const password = ref('');
const fieldErrors = ref<{ email?: string; password?: string }>({});
const formError = ref('');
const submitting = ref(false);

async function onSubmit(): Promise<void> {
  formError.value = '';
  const errors: { email?: string; password?: string } = {};
  const trimmedEmail = email.value.trim();
  if (!trimmedEmail) errors.email = 'Email is required.';
  if (!password.value) errors.password = 'Password is required.';
  fieldErrors.value = errors;
  if (!trimmedEmail || !password.value) return;

  submitting.value = true;
  try {
    await auth.login(trimmedEmail, password.value);
    notifications.success('Signed in. Welcome back.');
    await navigateTo('/', { replace: true });
  } catch (error) {
    const failure = getApiFailure(error);
    formError.value = failure?.message ?? 'Login failed. Please try again.';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="w-full max-w-sm">
    <div class="mb-8 flex flex-col items-center gap-3 text-center">
      <AppMonogram class="h-10 w-10 text-ink" />
      <div>
        <h1 class="text-lg font-semibold tracking-tight">Loka Store Admin</h1>
        <p class="mt-1 text-sm text-ink-2">Sign in to your account</p>
      </div>
    </div>

    <form
      class="rounded-xl border border-line bg-surface p-6 sm:p-8"
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
            for="email"
            class="mb-1.5 block text-xs font-medium text-ink-2"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="you@example.com"
            :class="fieldErrors.email ? 'border-cancelled-ink' : 'border-line-strong'"
            class="h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink transition-colors placeholder:text-ink-3 focus:border-ink focus:outline-none"
            :aria-invalid="fieldErrors.email ? 'true' : undefined"
          />
          <p
            v-if="fieldErrors.email"
            class="mt-1.5 text-xs text-cancelled-ink"
          >
            {{ fieldErrors.email }}
          </p>
        </div>

        <div>
          <label
            for="password"
            class="mb-1.5 block text-xs font-medium text-ink-2"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            placeholder="••••••••••••"
            :class="fieldErrors.password ? 'border-cancelled-ink' : 'border-line-strong'"
            class="h-10 w-full rounded-md border bg-surface px-3 text-sm text-ink transition-colors placeholder:text-ink-3 focus:border-ink focus:outline-none"
            :aria-invalid="fieldErrors.password ? 'true' : undefined"
          />
          <p
            v-if="fieldErrors.password"
            class="mt-1.5 text-xs text-cancelled-ink"
          >
            {{ fieldErrors.password }}
          </p>
        </div>

        <AppButton
          type="submit"
          variant="primary"
          class="w-full"
          :disabled="submitting"
          :loading="submitting"
        >
          {{ submitting ? 'Signing in…' : 'Sign in' }}
        </AppButton>
      </div>
    </form>
  </div>
</template>

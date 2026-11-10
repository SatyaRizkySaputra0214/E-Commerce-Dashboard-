<script setup lang="ts">
const menuOpen = ref(false);
const sidebarCollapsed = useCookie<boolean>('loka_sidebar_collapsed', {
  default: () => false,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
});
</script>

<template>
  <div class="min-h-screen">
    <NuxtLoadingIndicator
      color="var(--color-data)"
      :height="2"
      :throttle="100"
    />
    <NotificationCenter />

    <header class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface px-4 lg:hidden">
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-hover"
        aria-label="Open navigation"
        @click="menuOpen = true"
      >
        <AppIcon
          name="menu"
          class="h-5 w-5"
        />
      </button>
      <NuxtLink
        to="/"
        class="flex items-center gap-2.5"
      >
        <AppMonogram class="h-7 w-7 text-ink" />
        <span class="text-[15px] font-semibold tracking-tight">Loka Store</span>
      </NuxtLink>
    </header>

    <aside
      :class="sidebarCollapsed ? 'lg:w-[68px]' : 'lg:w-[240px]'"
      class="fixed inset-y-0 left-0 z-30 hidden border-r border-line bg-surface px-4 py-5 transition-[width] duration-200 lg:block"
    >
      <AppSidebar
        :collapsed="sidebarCollapsed"
        toggleable
        @toggle="sidebarCollapsed = !sidebarCollapsed"
      />
    </aside>

    <div
      :class="sidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-[240px]'"
      class="transition-[padding] duration-200"
    >
      <main class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <slot />
      </main>
    </div>

    <div
      v-if="menuOpen"
      class="fixed inset-0 z-40 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="absolute inset-0 bg-ink/20"
        @click="menuOpen = false"
      />
      <div class="absolute inset-y-0 left-0 flex w-[280px] flex-col border-r border-line bg-surface">
        <div class="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <span class="text-sm font-medium text-ink-2">Menu</span>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-hover"
            aria-label="Close navigation"
            @click="menuOpen = false"
          >
            <AppIcon
              name="close"
              class="h-5 w-5"
            />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-5 py-5">
          <AppSidebar @navigate="menuOpen = false" />
        </div>
      </div>
    </div>
  </div>
</template>

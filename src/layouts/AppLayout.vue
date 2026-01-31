<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div
    class="flex h-screen w-full overflow-hidden bg-background-light dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">

    <AppSidebar />

    <main class="flex-1 overflow-y-auto relative bg-background-light dark:bg-background-dark">
      <div class="min-h-full">
        <header class="sticky top-0 z-10 p-4 flex justify-end">
          <slot name="header-actions" />
        </header>

        <slot />
      </div>
    </main>

  </div>
</template>
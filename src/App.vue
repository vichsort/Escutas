<script setup>
import { RouterView } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useThemeStore } from '@/stores/theme_store'
import { Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>

<template>
  <AppLayout>
    <template #header-actions>
      <button @click="themeStore.toggleTheme"
        class="p-2 rounded-full bg-white dark:bg-surfaceDark shadow-sm hover:scale-105 transition-transform">
        <Moon v-if="!themeStore.isDark" :size="20" class="text-gray-800" />
        <Sun v-else :size="20" class="text-yellow-400" />
      </button>
    </template>

    <RouterView />
  </AppLayout>
</template>
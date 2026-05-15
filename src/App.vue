<script setup>
import { computed, shallowRef, watch } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import ReviewLayout from '@/layouts/ReviewLayout.vue'
import { usePreferencesStore } from '@/stores/preferences_store'
import { Sun, Moon } from 'lucide-vue-next'
import GlobalLoader from '@/components/ui/GlobalLoader.vue'

const route = useRoute()
const preferencesStore = usePreferencesStore()

const layouts = {
  review: ReviewLayout,
}

const currentLayout = shallowRef(AppLayout)

watch(
  () => route.meta.layout,
  (layout) => {
    currentLayout.value = layouts[layout] ?? AppLayout
  },
  { immediate: true }
)
</script>

<template>
  <GlobalLoader />

  <component :is="currentLayout">
    <!-- obs. isso aqui vai sair daqui logo com a página de config -->
    <template #header-actions>
      <button @click="preferencesStore.toggleTheme()"
        class="p-2 rounded-full bg-white dark:bg-surfaceDark shadow-sm hover:scale-105 transition-transform">
        <Moon v-if="!preferencesStore.isDark" :size="20" class="text-gray-800" />
        <Sun v-else :size="20" class="text-yellow-400" />
      </button>
    </template>

    <RouterView />
  </component>
</template>

<style scoped>
.layout-slide-enter-active,
.layout-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.layout-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
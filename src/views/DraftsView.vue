<script setup>
import { useRouter } from 'vue-router'
import { useDraftsStore } from '@/stores/drafts_store'
import { usePreferencesStore } from '@/stores/preferences_store'
import { ChevronLeft, FileText } from 'lucide-vue-next'
import ViewModeToggle from '@/components/ui/ViewModeToggle.vue'
import DraftListItem from '@/components/review/DraftListItem.vue'

const router = useRouter()
const draftsStore = useDraftsStore()
const preferences = usePreferencesStore()
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 md:p-10 space-y-8">

    <header class="flex items-center gap-4">
      <button
        @click="router.back()"
        class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400"
      >
        <ChevronLeft :size="28" />
      </button>

      <div class="flex-1">
        <h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Rascunhos
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          {{ draftsStore.allDrafts.length }} reviews em progresso
        </p>
      </div>

      <ViewModeToggle
        v-if="draftsStore.allDrafts.length > 0"
        v-model="preferences.viewMode"
        @update:modelValue="preferences.setViewMode"
      />
    </header>

    <!-- Empty state -->
    <div
      v-if="draftsStore.allDrafts.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center space-y-4"
    >
      <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
        <FileText :size="40" />
      </div>
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nenhum rascunho por aqui</h2>
        <p class="text-gray-500 dark:text-gray-400 max-w-xs">
          As reviews que começar e não publicar aparecerão aqui automaticamente.
        </p>
      </div>
      <button
        @click="router.push('/')"
        class="mt-4 px-6 py-2 bg-primary text-black font-bold rounded-full hover:scale-105 transition-transform"
      >
        Explorar Álbuns
      </button>
    </div>

    <!-- Grid / List -->
    <div
      v-else
      :class="[
        preferences.viewMode === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
          : 'flex flex-col gap-2'
      ]"
    >
      <DraftListItem
        v-for="draft in draftsStore.allDrafts"
        :key="draft.album.id"
        :draft="draft"
        :view-mode="preferences.viewMode"
      />
    </div>

  </div>
</template>

<style scoped>
.grid-move,
.grid-enter-active,
.grid-leave-active {
  transition: all 0.4s ease;
}
.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.grid-leave-active {
  position: absolute;
}
</style>
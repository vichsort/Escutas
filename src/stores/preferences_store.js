import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreferencesStore = defineStore('preferences', () => {
  const savedViewMode = localStorage.getItem('viewMode') ?? 'grid'

  const viewMode = ref(['grid', 'list'].includes(savedViewMode) ? savedViewMode : 'grid')

  function setViewMode(mode) {
    if (!['grid', 'list'].includes(mode)) return
    viewMode.value = mode
    localStorage.setItem('viewMode', mode)
  }

  function toggleViewMode() {
    setViewMode(viewMode.value === 'grid' ? 'list' : 'grid')
  }

  return { viewMode, setViewMode, toggleViewMode }
})
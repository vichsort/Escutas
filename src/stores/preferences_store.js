import { defineStore } from 'pinia'
import { useDark, useToggle, useStorage } from '@vueuse/core'

export const usePreferencesStore = defineStore('preferences', () => {
  // Tema
  const isDark = useDark({
    storageKey: 'theme',
    valueDark: 'dark',
    valueLight: 'light',
  })
  const toggleTheme = useToggle(isDark)

  // View Mode
  const viewMode = useStorage('viewMode', 'grid')

  function toggleViewMode() {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  }

  // Sidebar State
  const isSidebarOpen = useStorage('sidebarOpen', true)
  const toggleSidebar = useToggle(isSidebarOpen)

  return { 
    isDark, 
    toggleTheme,
    viewMode, 
    toggleViewMode,
    isSidebarOpen,
    toggleSidebar
  }
})
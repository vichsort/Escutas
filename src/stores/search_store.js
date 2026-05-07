import { defineStore } from 'pinia'
import { ref } from 'vue'
import searchService from '@/services/search_service'

export const useSearchStore = defineStore('search', () => {
    const quickResults = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    async function performQuickSearch(query, limit = 3) {
        if (!query || query.length < 2) {
            quickResults.value = []
            return
        }

        isLoading.value = true
        error.value = null
        try {
            quickResults.value = await searchService.quickSearch(query, limit)
        } catch (err) {
            console.error('Erro na busca rápida:', err)
            error.value = 'Falha ao realizar busca rápida.'
            quickResults.value = []
        } finally {
            isLoading.value = false
        }
    }

    function clearSearch() {
        quickResults.value = []
        error.value = null
    }

    return {
        quickResults,
        isLoading,
        error,
        performQuickSearch,
        clearSearch
    }
})
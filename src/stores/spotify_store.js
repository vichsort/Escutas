import { defineStore } from 'pinia'
import { ref } from 'vue'
import SpotifyService from '@/services/spotify_service'

export const useSpotifyStore = defineStore('spotify', () => {
    const suggestions = ref([])
    const lastFetchTime = ref(0) 
    const isLoading = ref(false)
    const CACHE_DURATION = 15 * 60 * 1000 

    async function fetchSuggestions(force = false) {
        const now = Date.now()
    
        if (suggestions.value.length > 0 && !force && (now - lastFetchTime.value < CACHE_DURATION)) {
            return suggestions.value
        }

        try {
            isLoading.value = true
            
            const data = await SpotifyService.getSuggestions()
            
            suggestions.value = data
            lastFetchTime.value = now
            
            return data
        } catch (error) {
            console.error('Erro na store spotify:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    function clearCache() {
        suggestions.value = []
        lastFetchTime.value = 0
    }

    return {
        suggestions,
        isLoading,
        fetchSuggestions,
        clearCache
    }
})
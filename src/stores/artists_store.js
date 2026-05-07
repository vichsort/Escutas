import { defineStore } from 'pinia'
import { ref } from 'vue'
import artistService from '@/services/artist_service'

export const useArtistStore = defineStore('artists', () => {
    const searchResults = ref([])
    const currentDiscography = ref(null)
    const currentProgress = ref(null)

    const isLoading = ref({
        search: false,
        discography: false,
        progress: false
    })
    const error = ref(null)

    async function search(query) {
        if (!query || query.length < 2) {
            searchResults.value = []
            return
        }
        isLoading.value.search = true
        error.value = null
        try {
            searchResults.value = await artistService.searchArtists(query)
        } catch (err) {
            console.error('Erro na busca de artistas:', err)
            error.value = err.response?.data?.message || 'Erro ao buscar artistas'
            searchResults.value = []
        } finally {
            isLoading.value.search = false
        }
    }

    async function fetchDiscography(artistId) {
        isLoading.value.discography = true
        error.value = null
        try {
            currentDiscography.value = await artistService.getArtistDiscography(artistId)
            return currentDiscography.value
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar discografia'
            throw err
        } finally {
            isLoading.value.discography = false
        }
    }

    async function fetchPlatinumProgress(artistId) {
        isLoading.value.progress = true
        error.value = null
        try {
            currentProgress.value = await artistService.getPlatinumProgress(artistId)
            return currentProgress.value
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar progresso de platina'
            throw err
        } finally {
            isLoading.value.progress = false
        }
    }

    return {
        searchResults,
        currentDiscography,
        currentProgress,
        isLoading,
        error,
        search,
        fetchDiscography,
        fetchPlatinumProgress
    }
})
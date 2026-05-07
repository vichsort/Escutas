import { defineStore } from 'pinia'
import { ref } from 'vue'
import albumService from '@/services/album_service'

export const useAlbumStore = defineStore('albums', () => {
    const searchResults = ref([])
    const currentAlbum = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    async function search(query) {
        if (!query) {
            searchResults.value = []
            return
        }
        isLoading.value = true
        error.value = null
        try {
            searchResults.value = await albumService.searchAlbums(query)
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao buscar álbuns'
            searchResults.value = []
        } finally {
            isLoading.value = false
        }
    }

    async function fetchAlbumDetails(spotifyId) {
        isLoading.value = true
        error.value = null
        try {
            currentAlbum.value = await albumService.getAlbumDetails(spotifyId)
            return currentAlbum.value
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar detalhes do álbum'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function submitCuration(spotifyId, isCanonical) {
        isLoading.value = true
        error.value = null
        try {
            const result = await albumService.curateAlbum(spotifyId, isCanonical)
            
            // Otimismo na UI: atualiza a flag localmente se o álbum estiver aberto na tela
            if (currentAlbum.value && currentAlbum.value.spotify_id === spotifyId) {
                currentAlbum.value.is_canonical = isCanonical
            }
            return result
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao registrar curadoria'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return { 
        searchResults, currentAlbum, isLoading, error, 
        search, fetchAlbumDetails, submitCuration 
    }
})
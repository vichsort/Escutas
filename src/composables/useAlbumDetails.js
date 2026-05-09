import { ref } from 'vue'
import { useAlbumStore } from '@/stores/albums_store'

export function useAlbumDetails() {
    const albumStore = useAlbumStore()
    // Estado local
    const album = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    // Buscar os detalhes completos do álbum
    const loadAlbum = async (albumId) => {
        if (!albumId) return
        
        isLoading.value = true
        error.value = null
        album.value = null

        try {
            const data = await albumStore.fetchAlbumDetails(albumId)
            album.value = data
        } catch (e) {
            console.error('Erro ao buscar detalhes do álbum:', e)
            error.value = e.response?.data?.message || "Não foi possível carregar as faixas deste álbum."
        } finally {
            isLoading.value = false
        }
    }

    return {
        album,
        isLoading,
        error,
        loadAlbum
    }
}
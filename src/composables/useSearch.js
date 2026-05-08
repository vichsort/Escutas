import { ref, computed, watch } from 'vue'
import { useAlbumStore } from '@/stores/albums_store'
import { useArtistStore } from '@/stores/artists_store'

export function useSearch() {
    const albumStore = useAlbumStore()
    const artistStore = useArtistStore()

    // busca
    const query = ref('')
    const activeFilters = ref(['album']) // Padrão: começa buscando por álbuns

    // loading
    // É true se qualquer uma das stores estiver buscando no momento
    const isSearching = computed(() => {
        return albumStore.isLoading || artistStore.isLoading?.search
    })

    // Resultados Unificados
    const combinedResults = computed(() => {
        const results = []
        
        // Se a tag 'album' estiver ativa, processa e injeta os álbuns
        if (activeFilters.value.includes('album') && albumStore.searchResults) {
            const mappedAlbums = albumStore.searchResults.map(album => ({
                ...album,
                itemType: 'album'
            }))
            results.push(...mappedAlbums)
        }
        
        // Se a tag 'artist' estiver ativa, processa e injeta os artistas
        if (activeFilters.value.includes('artist') && artistStore.searchResults) {
            const mappedArtists = artistStore.searchResults.map(artist => ({
                ...artist,
                itemType: 'artist'
            }))
            results.push(...mappedArtists)
        }
        
        return results
    })

    // Observador com Debounce (O coração do motor)
    let searchTimeout = null
    
    watch([query, activeFilters], ([newQuery, newFilters]) => {
        clearTimeout(searchTimeout)
        
        // Se a busca tiver menos de 2 letras, aborta e limpa os resultados
        if (!newQuery || newQuery.length < 2) {
            albumStore.searchResults = []
            artistStore.searchResults = []
            return
        }

        // Aguarda 500ms de inatividade antes de bater na API
        searchTimeout = setTimeout(() => {
            
            // busca de Álbuns
            if (newFilters.includes('album')) {
                albumStore.search(newQuery)
            } else {
                albumStore.searchResults = [] // Limpa se desmarcou
            }

            // busca de Artistas
            if (newFilters.includes('artist')) {
                artistStore.search(newQuery)
            } else {
                artistStore.searchResults = [] // Limpa se desmarcou
            }
            
        }, 500)
    })

    return {
        query,
        activeFilters,
        isSearching,
        combinedResults
    }
}
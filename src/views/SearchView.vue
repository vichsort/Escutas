<script setup>
import { ref, watch, computed } from 'vue'
import { Search, Disc } from 'lucide-vue-next'
import { useAlbumStore } from '@/stores/albums_store'
import { useArtistStore } from '@/stores/artists_store'
import BaseInput from '@/components/ui/BaseInput.vue'
import FilterTags from '@/components/ui/FilterTags.vue'
import AlbumCard from '@/components/albums/AlbumCard.vue'
import ArtistCard from '@/components/artists/ArtistCard.vue'
import CreateReviewModal from '@/components/reviews/CreateReviewModal.vue'

const albumStore = useAlbumStore()
const artistStore = useArtistStore()

const query = ref('')
const activeFilters = ref(['album']) // Padrão é começar buscando Álbuns
const searchFilters = [
    { id: 'album', label: 'Álbuns' },
    { id: 'artist', label: 'Artistas' }
]

const isModalOpen = ref(false)
const selectedAlbum = ref(null)

// 1. Orquestrando o Loading (É true se QUALQUER UMA das stores estiver buscando)
// Obs: Tratei a diferença de sintaxe entre as suas stores (boolean vs object)
const isSearching = computed(() => albumStore.isLoading || artistStore.isLoading?.search)

// 2. O Segredo da Mistura: Uma computed property que junta tudo num array só
const combinedResults = computed(() => {
    const results = []

    // Se a tag 'album' estiver ativa, injeta os álbuns no array final
    if (activeFilters.value.includes('album') && albumStore.searchResults) {
        const mappedAlbums = albumStore.searchResults.map(album => ({
            ...album,
            itemType: 'album' // Flag para o template saber o que renderizar
        }))
        results.push(...mappedAlbums)
    }

    // Se a tag 'artist' estiver ativa, injeta os artistas no array final
    if (activeFilters.value.includes('artist') && artistStore.searchResults) {
        const mappedArtists = artistStore.searchResults.map(artist => ({
            ...artist,
            itemType: 'artist' // Flag para o template
        }))
        results.push(...mappedArtists)
    }

    return results
})

// Debounce manual simples para não fludar a API
let searchTimeout = null
watch([query, activeFilters], ([newQuery, newFilters]) => {
    clearTimeout(searchTimeout)

    // Se apagou a busca, limpa os resultados de ambas as stores
    if (newQuery.length < 2) {
        albumStore.searchResults = []
        artistStore.searchResults = []
        return
    }

    searchTimeout = setTimeout(() => {
        // Dispara a busca apenas para as categorias selecionadas
        if (newFilters.includes('album')) {
            albumStore.search(newQuery)
        } else {
            albumStore.searchResults = [] // Limpa se desmarcou
        }

        if (newFilters.includes('artist')) {
            artistStore.search(newQuery)
        } else {
            artistStore.searchResults = [] // Limpa se desmarcou
        }
    }, 500)
})

const handleAlbumClick = (album) => {
    selectedAlbum.value = album
    isModalOpen.value = true
}

const handleArtistClick = (artist) => {
    // No futuro, redirecionar para a página do artista: router.push(`/artists/${artist.id}`)
    console.log('Clicou no artista:', artist.name)
}

const onReviewSuccess = () => {
    isModalOpen.value = false
}
</script>

<template>
    <div class="p-8 pb-24 max-w-7xl mx-auto space-y-8">

        <header class="flex flex-col gap-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Search class="text-primary" />
                    Explorar
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2">
                    Encontre o álbum perfeito para sua próxima review ou descubra novos artistas.
                </p>
            </div>

            <div class="relative max-w-2xl flex flex-col gap-4">
                <div class="relative">
                    <BaseInput v-model="query" placeholder="Digite o nome do álbum ou artista..." class="text-lg" />
                    <div v-if="isSearching" class="absolute right-4 top-1/2 -translate-y-1/2">
                        <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin">
                        </div>
                    </div>
                </div>

                <FilterTags :tags="searchFilters" v-model="activeFilters" default-tag="album" />
            </div>
        </header>

        <section>
            <EmptyState v-if="!query">
                <template #icon>
                    <Disc :size="64" class="text-gray-300 dark:text-gray-700" />
                </template>
                Comece a digitar para pesquisar...
            </EmptyState>

            <SkeletonGrid v-else-if="isSearching && combinedResults.length === 0" :count="5" />

            <div v-else-if="combinedResults.length > 0"
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4">
                <template v-for="item in combinedResults" :key="item.id + item.itemType">
                    <AlbumCard v-if="item.itemType === 'album'" :album="item" @click="handleAlbumClick(item)" />
                    <ArtistCard v-else-if="item.itemType === 'artist'" :artist="item"
                        @click="handleArtistClick(item)" />
                </template>
            </div>

            <EmptyState v-else-if="!isSearching && query.length >= 2">
                Nada encontrado para "<strong>{{ query }}</strong>" nos filtros selecionados. Tente outro termo. 🎸
            </EmptyState>
        </section>

    </div>

    <CreateReviewModal :is-open="isModalOpen" :album="selectedAlbum" @close="isModalOpen = false"
        @success="onReviewSuccess" />
</template>
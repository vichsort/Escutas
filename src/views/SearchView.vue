<script setup>
import { ref } from 'vue'
import { Search, Disc } from 'lucide-vue-next'
import { useSearch } from '@/composables/useSearch'
import BaseInput from '@/components/ui/BaseInput.vue'
import FilterTags from '@/components/ui/FilterTags.vue'
import AlbumCard from '@/components/albums/AlbumCard.vue'
import ArtistCard from '@/components/artists/ArtistCard.vue'
import SkeletonGrid from '@/components/ui/SkeletonGrid.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import CreateReviewModal from '@/components/reviews/CreateReviewModal.vue'

const { 
    query, 
    activeFilters, 
    isSearching, 
    combinedResults 
} = useSearch()

const searchFilters = [
    { id: 'album', label: 'Álbuns' },
    { id: 'artist', label: 'Artistas' }
]

const isModalOpen = ref(false)
const selectedAlbum = ref(null)

const handleAlbumClick = (album) => {
    selectedAlbum.value = album
    isModalOpen.value = true
}

const handleArtistClick = (artist) => {
    // TODO: Redirecionar para o slug do artista no futuro
    console.log('Navegar para o perfil do artista:', artist.name)
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
                    <BaseInput v-model="query" placeholder="O que você quer ouvir hoje?" class="text-lg" />
                    
                    <div v-if="isSearching" class="absolute right-4 top-1/2 -translate-y-1/2">
                        <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>

                <FilterTags 
                    :tags="searchFilters" 
                    v-model="activeFilters" 
                    default-tag="album"
                />
            </div>
        </header>

        <section>
            
            <EmptyState v-if="!query || query.length < 2">
                <template #icon>
                    <Disc :size="64" class="text-gray-300 dark:text-gray-700" />
                </template>
                Comece a digitar para pesquisar...
            </EmptyState>

            <SkeletonGrid v-else-if="isSearching && combinedResults.length === 0" :count="5" />

            <div 
                v-else-if="combinedResults.length > 0" 
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4"
            >
                <template v-for="item in combinedResults" :key="item.id + item.itemType">
                    
                    <AlbumCard 
                        v-if="item.itemType === 'album'" 
                        :album="item" 
                        @click="handleAlbumClick(item)" 
                    />

                    <ArtistCard 
                        v-else-if="item.itemType === 'artist'" 
                        :artist="item"
                        @click="handleArtistClick(item)" 
                    />

                </template>
            </div>

            <EmptyState v-else-if="!isSearching && query.length >= 2">
                Nada encontrado para "<strong>{{ query }}</strong>" nos filtros selecionados. Tente outro termo. 🎸
            </EmptyState>

        </section>

    </div>

    <CreateReviewModal 
        :is-open="isModalOpen" 
        :album="selectedAlbum" 
        @close="isModalOpen = false"
        @success="onReviewSuccess" 
    />
</template>
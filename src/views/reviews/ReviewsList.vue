<script setup>
import { ref, watch } from 'vue'
import SpotifyService from '@/services/spotify_service'
import AlbumCard from '@/components/media/AlbumCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import CreateReviewModal from '@/components/reviews/CreateReviewModal.vue'
import { Search, Disc } from 'lucide-vue-next'

const query = ref('')
const results = ref([])
const isLoading = ref(false)
const hasSearched = ref(false)
const isModalOpen = ref(false)
const selectedAlbum = ref(null)
let debounceTimeout = null

const performSearch = async () => {
  if (!query.value || query.value.length < 2) {
    results.value = []
    return
  }

  try {
    isLoading.value = true
    hasSearched.value = true
    results.value = await SpotifyService.searchAlbums(query.value)
  } catch (error) {
    console.error('Erro na busca:', error)
  } finally {
    isLoading.value = false
  }
}

watch(query, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(performSearch, 250)
})

const handleAlbumClick = (album) => {
  selectedAlbum.value = album
  isModalOpen.value = true
}

const onReviewSuccess = () => {
  alert('Review publicada com sucesso! 🎵')
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
          Encontre o álbum perfeito para sua próxima review.
        </p>
      </div>

      <div class="relative max-w-2xl">
        <BaseInput v-model="query" placeholder="Digite o nome do álbum ou artista..." class="text-lg" />
        <div v-if="isLoading" class="absolute right-4 top-1/2 -translate-y-1/2">
          <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </header>

    <section>

      <div v-if="!hasSearched && !query"
        class="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
        <Disc :size="64" class="mb-4 text-gray-300 dark:text-gray-700" />
        <p>Comece a digitar para pesquisar...</p>
      </div>

      <div v-else-if="isLoading && results.length === 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="i in 5" :key="i" class="aspect-square bg-gray-200 dark:bg-surfaceDark rounded-2xl animate-pulse">
        </div>
      </div>

      <div v-else-if="results.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4">
        <AlbumCard v-for="album in results" :key="album.id" :album="album" @click="handleAlbumClick(album)" />
      </div>

      <div v-else-if="hasSearched && !isLoading && query.length >= 2" class="text-center py-12 text-gray-500">
        Nenhum álbum encontrado para "<strong>{{ query }}</strong>". Tente outro termo. 🎸
      </div>

    </section>

  </div>
  <div class="p-8 pb-24 max-w-7xl mx-auto space-y-8">

    <CreateReviewModal :is-open="isModalOpen" :album="selectedAlbum" @close="isModalOpen = false"
      @success="onReviewSuccess" />

  </div>
</template>
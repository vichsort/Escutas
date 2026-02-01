<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth_store'
import { useSpotifyStore } from '@/stores/spotify_store'
import SpotifyService from '@/services/spotify_service'
import AlbumCard from '@/components/media/AlbumCard.vue'
import NowPlayingCard from '@/components/media/NowPlayingCard.vue'
import CreateReviewModal from '@/components/reviews/CreateReviewModal.vue' // <--- 1. Importar Modal

const authStore = useAuthStore()
const spotifyStore = useSpotifyStore()

const nowPlaying = ref(null)
const isPageLoading = ref(true)
const isModalOpen = ref(false)
const selectedAlbum = ref(null)

onMounted(async () => {
  try {
    isPageLoading.value = true

    const [_, nowPlayingData] = await Promise.all([
      spotifyStore.fetchSuggestions(),
      SpotifyService.getNowPlaying()
    ])

    nowPlaying.value = nowPlayingData

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  } finally {
    isPageLoading.value = false
  }
})

const handleAlbumClick = (album) => {
  selectedAlbum.value = album
  isModalOpen.value = true
}

const handleRateNowPlaying = () => {
  if (!nowPlaying.value || !nowPlaying.value.album) return
  selectedAlbum.value = nowPlaying.value.album
  isModalOpen.value = true
}

const onReviewSuccess = () => {

}
</script>

<template>
  <div class="p-8 space-y-10 pb-24">

    <header>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        Olá, {{ authStore.user?.display_name?.split(' ')[0] || 'Visitante' }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400">
        Que tal registrar o que você está sentindo hoje?
      </p>
    </header>

    <NowPlayingCard v-if="nowPlaying" :track="nowPlaying" @rate="handleRateNowPlaying" />

    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Baseado no que você ouviu
        </h2>
      </div>

      <div v-if="isPageLoading && spotifyStore.suggestions.length === 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="i in 5" :key="i" class="space-y-3">
          <div class="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AlbumCard v-for="album in spotifyStore.suggestions" :key="album.id" :album="album"
          @click="handleAlbumClick(album)" />
      </div>

      <div v-if="!isPageLoading && spotifyStore.suggestions.length === 0" class="text-center py-12 text-gray-500">
        Nenhuma sugestão encontrada.
      </div>
    </section>

    <CreateReviewModal :is-open="isModalOpen" :album="selectedAlbum" @close="isModalOpen = false"
      @success="onReviewSuccess" />

  </div>
</template>
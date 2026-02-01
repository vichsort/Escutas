<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth_store'
import SpotifyService from '@/services/spotify_service'
import AlbumCard from '@/components/media/AlbumCard.vue'
import NowPlayingCard from '@/components/media/NowPlayingCard.vue'

const authStore = useAuthStore()
const suggestions = ref([])
const nowPlaying = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    isLoading.value = true

    const [suggestionsData, nowPlayingData] = await Promise.all([
      SpotifyService.getSuggestions(),
      SpotifyService.getNowPlaying()
    ])

    suggestions.value = suggestionsData
    nowPlaying.value = nowPlayingData

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  } finally {
    isLoading.value = false
  }
})

const handleAlbumClick = (album) => {
  console.log('Navegar para review de álbum:', album.name)
}

const handleRateTrack = () => {
  console.log('Abrir modal para avaliar:', nowPlaying.value.track_name)
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

    <NowPlayingCard v-if="nowPlaying" :track="nowPlaying" @rate="handleRateTrack" />

    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Baseado no que você ouviu
        </h2>
      </div>

      <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="i in 5" :key="i" class="space-y-3">
          <div class="aspect-square bg-gray-200 dark:bg-surfaceDark rounded-2xl animate-pulse"></div>
          <div class="h-4 w-3/4 bg-gray-200 dark:bg-surfaceDark rounded animate-pulse"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <AlbumCard v-for="album in suggestions" :key="album.id" :album="album" @click="handleAlbumClick(album)" />
      </div>

      <div v-if="!isLoading && suggestions.length === 0" class="text-center py-12 text-gray-500">
        Nenhuma sugestão encontrada.
      </div>
    </section>

  </div>
</template>
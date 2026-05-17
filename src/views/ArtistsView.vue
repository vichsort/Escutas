<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useArtistStore } from '@/stores/artist_store'
import ArtistHeader from '@/components/artists/ArtistHeader.vue'
import DiscographyGrid from '@/components/artists/DiscographyGrid.vue'
import CreateReviewModal from '@/components/review/CreateReviewModal.vue'

const route = useRoute()
const artistStore = useArtistStore()

const artistId = route.params.id

const isModalOpen = ref(false)
const selectedAlbum = ref(null)

const artist = computed(() => artistStore.currentDiscography?.artist)
const stats = computed(() => artistStore.currentDiscography?.stats)
const discography = computed(() => artistStore.currentDiscography?.discography ?? [])

onMounted(() => {
    artistStore.fetchDiscography(artistId)
})

const isLoading = computed(() => artistStore.isLoading.discography)
const error = computed(() => artistStore.error)

const handleAlbumClick = (album) => {
    selectedAlbum.value = {
        id: album.album_id,
        name: album.clean_name,
        artist: artist.value?.name,
        cover_url: album.cover_url,
    }
    isModalOpen.value = true
}

const handleModalClose = () => {
    isModalOpen.value = false
    selectedAlbum.value = null
}

const handleReviewSuccess = () => {
    handleModalClose()
    artistStore.fetchDiscography(artistId)
}
</script>

<template>
    <div class="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-12">

        <div v-if="error" class="flex flex-col items-center justify-center py-20 text-center">
            <h2 class="text-2xl font-bold text-red-500 mb-2">Ops! Algo deu errado</h2>
            <p class="text-gray-500">{{ error }}</p>
        </div>

        <template v-else>
            <ArtistHeader v-if="artist && stats" :artist="artist" :stats="stats" />

            <div class="mt-10">
                <DiscographyGrid :albums="discography" :artist-name="artist?.name ?? ''" :is-loading="isLoading"
                    @album-click="handleAlbumClick" />
            </div>
        </template>

    </div>

    <CreateReviewModal :is-open="isModalOpen" :album="selectedAlbum" @close="handleModalClose"
        @success="handleReviewSuccess" />
</template>
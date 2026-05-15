<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LEGACY_OPTIONS } from '@/constants/review_constants'
import ReviewHeader from '@/components/reviews/ReviewHeader.vue'
import AlbumDetailsSidebar from '@/components/albums/AlbumDetailsSidebar.vue'
import ReviewActionFooter from '@/components/reviews/ReviewActionFooter.vue'
import TrackRatingRow from '@/components/reviews/TrackRatingRow.vue'
import TrackListSkeleton from '@/components/reviews/TrackListSkeleton.vue'
import { useAlbumDetails } from '@/composables/useAlbumDetails'
import { useReviewDraft } from '@/composables/useReviewDraft'

const route = useRoute()
const router = useRouter()
const albumId = route.params.id

const {
    album: fullAlbum,
    isLoading: isLoadingTracks,
    error: fetchError,
    loadAlbum
} = useAlbumDetails()

const {
    tracks, reviewText, isLegacyMode, isSubmitting, error: submitError, currentAverage,
    initializeDraft, toggleIgnoreTrack, submitReview
} = useReviewDraft(route.params.id)

onMounted(async () => {
    const needsFetch = !tracks.value.length || fullAlbum.value?.id !== albumId

    if (needsFetch) {
        await loadAlbum(albumId)
        if (fullAlbum.value) {
            initializeDraft(fullAlbum.value, fullAlbum.value.tracks)
        }
    }

    if (fetchError.value) {
        setTimeout(() => router.push('/'), 3000)
    }
})

const handleSubmit = async () => {
    const success = await submitReview()
    if (success) {
        router.push('/')
    }
}
</script>

<template>
    <div class="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-12">

        <div v-if="fetchError" class="flex flex-col items-center justify-center py-20 text-center">
            <h2 class="text-2xl font-bold text-red-500 mb-2">Ops! Algo deu errado</h2>
            <p class="text-gray-500">{{ fetchError }}</p>
            <p class="text-sm mt-4 text-primary">Redirecionando em instantes...</p>
        </div>

        <div v-else class="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

            <div class="flex-1 w-full space-y-10">

                <ReviewHeader
                    :album="fullAlbum || tracks[0]"
                    :tracks="tracks"
                    :is-legacy-mode="isLegacyMode"
                    @update:is-legacy-mode="isLegacyMode = $event"
                />

                <div class="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400 px-2">
                    <span class="w-8 text-center">#</span>
                    <span class="flex-1">Título</span>
                    <span class="w-32 md:w-40 text-right">Avaliação</span>
                </div>

                <div class="space-y-1">
                    <TrackListSkeleton v-if="isLoadingTracks" :count="10" />

                    <template v-else>
                        <TrackRatingRow
                            v-for="track in tracks"
                            :key="track.id"
                            :track="track"
                            :is-legacy-mode="isLegacyMode"
                            :legacy-options="LEGACY_OPTIONS"
                            @update:score="(payload) => track.userScore = payload.score"
                            @toggle-ignore="toggleIgnoreTrack"
                        />
                    </template>
                </div>

                <ReviewActionFooter
                    v-model="reviewText"
                    :current-average="currentAverage"
                    :is-submitting="isSubmitting"
                    :is-ready="!isLoadingTracks"
                    @cancel="router.back()"
                    @submit="handleSubmit"
                />

                <div
                    v-if="submitError"
                    class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center border border-red-100 dark:border-red-800/50"
                >
                    {{ submitError }}
                </div>
            </div>

            <AlbumDetailsSidebar :album="fullAlbum || tracks[0]" />

        </div>
    </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
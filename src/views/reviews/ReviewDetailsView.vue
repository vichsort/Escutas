<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { LEGACY_OPTIONS } from '@/constants/review_constants'
import { useReviewDetails } from '@/composables/useReviewDetails'
import ReviewHeader from '@/components/reviews/ReviewHeader.vue'
import ReviewGuide from '@/components/reviews/ReviewGuide.vue'
import ReviewExportCard from '@/components/reviews/ReviewExportCard.vue'
import TrackRatingRow from '@/components/reviews/TrackRatingRow.vue'
import TrackListSkeleton from '@/components/reviews/TrackListSkeleton.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useAuthStore } from '@/stores/auth_store'

const authStore = useAuthStore()

const route = useRoute()
const exportCardRef = ref(null)

const {
    review, isLoading, isOwner, normalizedTracks,
    isLegacyMode, isDeleting, isExporting, isSaving,
    isDeleteModalOpen, editText,
    fetchReviewData, handleEdit, handleDelete,
    handleSaveText, handleExport, handleBlogPost, handleTogglePrivacy
} = useReviewDetails(exportCardRef)

onMounted(() => fetchReviewData(route.params.id))
watch(() => route.params.id, fetchReviewData)
</script>

<template>
    <div class="max-w-[1400px] mx-auto p-6 md:p-8 lg:p-12">

        <div v-if="isLoading || !review" class="flex items-center justify-center py-20">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-organic-spin" />
        </div>

        <div v-else class="space-y-10">

            <ReviewHeader
                :album="{
                    name: review.album_name,
                    artist: review.artist_name,
                    artist_spotify_id: review.spotify_artist_id,
                    cover_url: review.cover_url,
                    release_date: review.created_at,
                    total_tracks: normalizedTracks.length
                }"
                :tracks="normalizedTracks"
                :is-legacy-mode="isLegacyMode"
                :show-toolbar="true"
                :is-owner="isOwner"
                :is-exporting="isExporting"
                @update:is-legacy-mode="isLegacyMode = $event"
                @edit="handleEdit"
                @delete="isDeleteModalOpen = true"
                @export="handleExport"
                :is-private="review.is_private"
                @toggle-privacy="handleTogglePrivacy"
            />

            <div class="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400 px-2">
                <span class="w-8 text-center">#</span>
                <span class="flex-1">Título</span>
                <span class="w-32 md:w-40 text-right">Nota</span>
            </div>

            <div class="space-y-1">
                <TrackListSkeleton v-if="isLoading" :count="normalizedTracks.length || 10" />
                <TrackRatingRow
                    v-else
                    v-for="track in normalizedTracks"
                    :key="track.id"
                    :track="track"
                    :is-legacy-mode="isLegacyMode"
                    :legacy-options="LEGACY_OPTIONS"
                    :readonly="true"
                />
            </div>

            <ReviewGuide
                v-model="editText"
                :is-owner="isOwner"
                :is-saving="isSaving"
                :review-text="review.review_text"
                @save="handleSaveText"
                @blog-post="handleBlogPost"
            />

            <section class="pt-4 border-t border-gray-200 dark:border-gray-800/50">
                <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">
                    Card de Exportação
                </h3>
                <ReviewExportCard
                    ref="exportCardRef"
                    :review="review"
                    :user-name="authStore.user?.display_name"
                />
            </section>

        </div>
    </div>

    <ConfirmModal
        :is-open="isDeleteModalOpen"
        title="Deletar review"
        description="Esta ação é irreversível. Tem certeza que deseja deletar esta review?"
        confirm-label="Deletar"
        variant="danger"
        :is-loading="isDeleting"
        @close="isDeleteModalOpen = false"
        @confirm="handleDelete"
    />
</template>
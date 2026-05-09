<script setup>
import { ref, watch, computed } from 'vue'
import { X, Loader2, Maximize2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { LEGACY_OPTIONS } from '@/constants/review_constants'
import BaseModal from '@/components/ui/BaseModal.vue'
import ReviewModeToggle from '@/components/reviews/ReviewModeToggle.vue'
import TrackListSkeleton from '@/components/reviews/TrackListSkeleton.vue'
import TrackRatingRow from '@/components/reviews/TrackRatingRow.vue'
import { useAlbumDetails } from '@/composables/useAlbumDetails'
import { useReviewDraft } from '@/composables/useReviewDraft'

const props = defineProps({
    isOpen: Boolean,
    album: Object
})

const emit = defineEmits(['close', 'success'])

const {
    album: fullAlbum,
    isLoading: isLoadingTracks,
    error: fetchError,
    loadAlbum
} = useAlbumDetails()

const { 
    tracks, reviewText, isLegacyMode, isSubmitting, error: submitError, currentAverage, 
    initializeDraft, toggleIgnoreTrack, submitReview 
} = useReviewDraft(computed(() => props.album?.id))

const router = useRouter()

const handleExpand = () => {
    handleClose()
    if (props.album?.id) {
        // Formato Objeto (À prova de refatorações de URL futuras)
        router.push({ 
            name: 'create-review', 
            params: { id: props.album.id } 
        })
    }
}

const combinedError = computed(() => fetchError.value || submitError.value)

watch(() => props.isOpen, async (isOpen) => {
    if (isOpen && props.album?.id) {
        await loadAlbum(props.album.id)
        
        if (fullAlbum.value?.tracks) {
            initializeDraft(fullAlbum.value, fullAlbum.value.tracks)
        }
    } else {
        // Limpa o estado visual quando fecha
        isLegacyMode.value = false
    }
})

const handleClose = () => emit('close')

const handleSubmit = async () => {
    // Passamos os dados básicos do álbum para o composable montar o payload
    const success = await submitReview(props.album)
    if (success) {
        emit('success')
        handleClose()
    }
}
</script>

<template>
    <BaseModal :is-open="isOpen" @close="handleClose">

        <template #header>
            <div class="flex flex-col gap-4">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-4">
                        <img :src="album?.cover_url" class="w-16 h-16 rounded shadow-lg object-cover"
                            :alt="album?.name" />
                        <div>
                            <h2 class="text-xl font-bold leading-tight truncate text-gray-900 dark:text-white">{{
                                album?.name }}</h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ album?.artist }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-1">
                        <button @click="handleExpand" title="Expandir para tela cheia" 
                                class="p-2 rounded-full transition-colors text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white">
                            <Maximize2 :size="20" />
                        </button>
                        
                        <button @click="handleClose" title="Fechar" 
                                class="p-2 rounded-full transition-colors text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white">
                            <X :size="24" />
                        </button>
                    </div>
                </div>

                <ReviewModeToggle v-model="isLegacyMode" />
            </div>
        </template>

        <template #default>
            <div class="space-y-6">

                <TrackListSkeleton v-if="isLoadingTracks" :count="album?.total_tracks || 8" />

                <div v-else class="space-y-1">
                    <TrackRatingRow v-for="track in tracks" :key="track.id" :track="track"
                        :is-legacy-mode="isLegacyMode" :legacy-options="LEGACY_OPTIONS"
                        @update:score="(payload) => track.userScore = payload.score"
                        @toggle-ignore="toggleIgnoreTrack" />

                    <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <textarea v-model="reviewText" rows="4" placeholder="O que você achou do álbum?"
                            class="w-full p-4 rounded-xl outline-none resize-none transition-all border
                                   bg-backgroundLight border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400
                                   dark:bg-backgroundDark dark:border-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-primary"></textarea>
                    </div>
                </div>

                <div v-if="combinedError"
                    class="p-3 rounded-lg text-sm border text-center bg-red-50 text-red-600 border-red-100 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800">
                    {{ combinedError }}
                </div>
            </div>
        </template>

        <template #footer>
            <div class="mr-auto flex items-center gap-2">
                <span class="text-sm uppercase font-bold text-gray-400">Média:</span>
                <span class="text-2xl font-black text-gray-900 dark:text-white">{{ currentAverage }}</span>
            </div>

            <button @click="handleClose"
                class="px-6 py-3 rounded-full font-bold text-sm transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-surfaceDark">
                Cancelar
            </button>

            <button @click="handleSubmit" :disabled="isSubmitting || isLoadingTracks"
                class="bg-primary text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-105 hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center shadow-lg shadow-primary/20">
                <Loader2 v-if="isSubmitting" class="animate-spin mr-2" :size="18" />
                {{ isSubmitting ? 'Publicando...' : 'Publicar Review' }}
            </button>
        </template>

    </BaseModal>
</template>
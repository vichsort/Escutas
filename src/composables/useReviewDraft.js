import { ref, computed } from 'vue'
import { useReviewStore } from '@/stores/reviews_store'
import { useDraftsStore } from '@/stores/drafts_store'

export function useReviewDraft() {
    const reviewStore = useReviewStore()
    const draftsStore = useDraftsStore()
    const isSubmitting = ref(false)
    const error = ref(null)

    // O get/set permite que o v-model="reviewText" continue funcionando sem alterar a UI
    const tracks = computed({
        get: () => draftsStore.activeDraft?.tracks || [],
        set: (val) => { if (draftsStore.activeDraft) draftsStore.activeDraft.tracks = val }
    })

    const reviewText = computed({
        get: () => draftsStore.activeDraft?.reviewText || '',
        set: (val) => { if (draftsStore.activeDraft) draftsStore.activeDraft.reviewText = val }
    })

    const isLegacyMode = computed({
        get: () => draftsStore.activeDraft?.isLegacyMode || false,
        set: (val) => { if (draftsStore.activeDraft) draftsStore.activeDraft.isLegacyMode = val }
    })

    // A média agora vem mastigada direto da store
    const currentAverage = computed(() => draftsStore.draftAverage)

    // Inicializar Rascunho
    const initializeDraft = (albumData, rawTracks) => {
        // Blindagem de segurança caso os dados não cheguem
        if (!albumData || !rawTracks) return

        const isDifferentAlbum = !draftsStore.activeDraft || draftsStore.activeDraft?.album?.id !== albumData.id

        if (isDifferentAlbum) {
            draftsStore.initDraft(albumData, rawTracks)
        }
        error.value = null
    }

    // Riscar/Desriscar Faixa
    const toggleIgnoreTrack = (trackId) => {
        if (!draftsStore.activeDraft) return
        const track = draftsStore.activeDraft.tracks.find(t => t.id === trackId)
        if (track) {
            track.isIgnored = !track.isIgnored
        }
    }

    // Enviar a Review
    const submitReview = async () => {
        if (!draftsStore.activeDraft) return false

        try {
            isSubmitting.value = true
            error.value = null

            const draft = draftsStore.activeDraft

            const payload = {
                album: draft.album,
                tracks: draft.tracks.map(t => ({
                    id: t.id,
                    name: t.name,
                    track_number: t.track_number,
                    userScore: Number(t.userScore),
                    is_ignored: t.isIgnored
                })),
                review_text: draft.reviewText
            }

            await reviewStore.createReview(payload)
            
            draftsStore.clearDraft()
            return true 

        } catch (e) {
            error.value = e.response?.data?.message || "Erro ao salvar review."
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        tracks,
        reviewText,
        isLegacyMode,
        isSubmitting,
        error,
        currentAverage,
        initializeDraft,
        toggleIgnoreTrack,
        submitReview
    }
}
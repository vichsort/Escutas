import { ref, computed, toValue } from 'vue'
import { useReviewStore } from '@/stores/reviews_store'
import { useDraftsStore } from '@/stores/drafts_store'

export function useReviewDraft(albumIdParam) {
    const reviewStore = useReviewStore()
    const draftsStore = useDraftsStore()

    // toValue resolve ref, computed E getter function (() => value)
    const currentId = computed(() => toValue(albumIdParam))

    const isSubmitting = ref(false)
    const error = ref(null)

    const activeDraft = computed(() => draftsStore.drafts[currentId.value])

    const tracks = computed({
        get: () => activeDraft.value?.tracks || [],
        set: (val) => { 
            if (activeDraft.value) {
                activeDraft.value.tracks = val
                draftsStore.touchDraft(currentId.value)
            }
        }
    })

    const reviewText = computed({
        get: () => activeDraft.value?.reviewText || '',
        set: (val) => { 
            if (activeDraft.value) {
                activeDraft.value.reviewText = val
                draftsStore.touchDraft(currentId.value)
            }
        }
    })

    const isLegacyMode = computed({
        get: () => activeDraft.value?.isLegacyMode || false,
        set: (val) => { 
            if (activeDraft.value) {
                activeDraft.value.isLegacyMode = val
                draftsStore.touchDraft(currentId.value)
            }
        }
    })

    const currentAverage = computed(() => draftsStore.getDraftAverage(currentId.value))

    const initializeDraft = (albumData, rawTracks) => {
        if (!albumData || !rawTracks) return
        draftsStore.initDraft(albumData, rawTracks)
        error.value = null
    }

    const toggleIgnoreTrack = (trackId) => {
        if (!activeDraft.value) return
        const track = activeDraft.value.tracks.find(t => t.id === trackId)
        if (track) {
            track.isIgnored = !track.isIgnored
            draftsStore.touchDraft(currentId.value)
        }
    }

    const submitReview = async () => {
        if (!activeDraft.value) return false

        try {
            isSubmitting.value = true
            error.value = null

            const draft = activeDraft.value

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
            draftsStore.deleteDraft(currentId.value)
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
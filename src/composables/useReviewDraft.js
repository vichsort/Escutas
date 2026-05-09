import { ref, computed } from 'vue'
import { useReviewStore } from '@/stores/reviews_store'

export function useReviewDraft() {
    const reviewStore = useReviewStore()
    const tracks = ref([])
    const reviewText = ref('')
    const isSubmitting = ref(false)
    const error = ref(null)

    // Inicializar o rascunho com os dados limpos do Álbum
    const initializeDraft = (rawTracks) => {
        if (!rawTracks) return

        tracks.value = rawTracks.map(t => ({
            id: t.id,
            name: t.name,
            track_number: t.track_number,
            userScore: 7.0,
            isIgnored: t.suggested_ignore || false
        }))
        
        reviewText.value = ''
        error.value = null
    }

    // Riscar ou "Desriscar" uma faixa ('X' no hover)
    const toggleIgnoreTrack = (trackId) => {
        const track = tracks.value.find(t => t.id === trackId)
        if (track) {
            track.isIgnored = !track.isIgnored
        }
    }

    // Média em tempo real
    const currentAverage = computed(() => {
        // Filtra para calcular a média APENAS das faixas que não estão ignoradas
        const validTracks = tracks.value.filter(t => !t.isIgnored)
        
        if (validTracks.length === 0) return "0.0"

        const total = validTracks.reduce((acc, t) => acc + (Number(t.userScore) || 0), 0)
        return (total / validTracks.length).toFixed(1)
    })

    // Enviar a Review
    const submitReview = async (albumData) => {
        try {
            isSubmitting.value = true
            error.value = null

            const payload = {
                album: {
                    id: albumData.id,
                    name: albumData.name,
                    artist: albumData.artist,
                    cover: albumData.cover_url
                },
                // Mapeia de volta para o formato que a API espera
                tracks: tracks.value.map(t => ({
                    id: t.id,
                    name: t.name,
                    track_number: t.track_number,
                    userScore: Number(t.userScore),
                    is_ignored: t.isIgnored
                })),
                review_text: reviewText.value
            }

            await reviewStore.createReview(payload)
            return true // Sinaliza sucesso para a View fechar o Modal

        } catch (e) {
            error.value = e.response?.data?.message || "Erro ao salvar review."
            return false // Sinaliza falha
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        tracks,
        reviewText,
        isSubmitting,
        error,
        currentAverage,
        initializeDraft,
        toggleIgnoreTrack,
        submitReview
    }
}
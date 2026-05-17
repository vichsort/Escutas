import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth_store'
import { useReviewStore } from '@/stores/reviews_store'
import html2canvas from 'html2canvas'

export function useReviewDetails(exportCardRef) {
    const router = useRouter()
    const authStore = useAuthStore()
    const reviewStore = useReviewStore()

    const isDeleting = ref(false)
    const isExporting = ref(false)
    const isSaving = ref(false)
    const isLegacyMode = ref(false)
    const isDeleteModalOpen = ref(false)
    const editText = ref('')

    const review = computed(() => reviewStore.currentReview)
    const isLoading = computed(() => reviewStore.isLoading)

    const isOwner = computed(() =>
        authStore.user && review.value && authStore.user.id === review.value.user_id
    )

    const normalizedTracks = computed(() =>
        (review.value?.tracks ?? []).map(t => ({
            id: t.id,
            name: t.track_name,
            track_number: t.track_number,
            userScore: t.score,
            isIgnored: t.is_ignored
        }))
    )

    const fetchReviewData = async (id) => {
        if (!id) return
        try {
            const data = await reviewStore.fetchReview(id)
            editText.value = data.review_text || ''
        } catch {
            router.push('/')
        }
    }

    const handleEdit = () => {
        router.push({ name: 'create-review', params: { id: review.value.spotify_album_id } })
    }

    const handleDelete = async () => {
        try {
            isDeleting.value = true
            await reviewStore.deleteReview(review.value.id)
            router.push('/library')
        } catch {
            // TODO: toast de erro
        } finally {
            isDeleting.value = false
            isDeleteModalOpen.value = false
        }
    }

    const handleSaveText = async () => {
        try {
            isSaving.value = true
            await reviewStore.updateReview(review.value.id, { review_text: editText.value })
        } catch {
            // TODO: toast de erro
        } finally {
            isSaving.value = false
        }
    }

    const handleTogglePrivacy = async () => {
        try {
            await reviewStore.updateReview(review.value.id, { is_private: !review.value.is_private })
            review.value.is_private = !review.value.is_private
        } catch {
            // TODO: toast de erro
        }
    }

    const handleExport = async () => {
        const el = exportCardRef.value?.$el
        if (!el) return
        try {
            isExporting.value = true
            await new Promise(r => setTimeout(r, 100))
            const canvas = await html2canvas(el, {
                backgroundColor: '#121212',
                scale: 2,
                useCORS: true,
                logging: false
            })
            const link = document.createElement('a')
            link.download = `review-${review.value.album_name.substring(0, 30)}.png`
            link.href = canvas.toDataURL()
            link.click()
        } catch (err) {
            console.error('Erro ao exportar:', err)
        } finally {
            isExporting.value = false
        }
    }

    const handleBlogPost = () => {
        router.push({
            name: 'blog-write',
            query: {
                mentionType: 'REVIEW',
                mentionId: review.value.id,
                mentionName: review.value.album_name
            }
        })
    }

    return {
        review,
        isLoading,
        isOwner,
        normalizedTracks,
        isLegacyMode,
        isDeleting,
        isExporting,
        isSaving,
        isDeleteModalOpen,
        editText,
        fetchReviewData,
        handleEdit,
        handleDelete,
        handleSaveText,
        handleTogglePrivacy,
        handleExport,
        handleBlogPost,
    }
}
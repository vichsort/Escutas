import { defineStore } from 'pinia'
import { ref } from 'vue'
import reviewService from '@/services/review_service'

export const useReviewStore = defineStore('reviews', () => {
    const currentReview = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    async function createReview(payload) {
        isLoading.value = true
        error.value = null
        try {
            const data = await reviewService.createReview(payload)
            currentReview.value = data
            return data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao criar review'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function fetchReview(reviewId) {
        isLoading.value = true
        error.value = null
        try {
            const data = await reviewService.getReviewById(reviewId)
            currentReview.value = data
            return data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao buscar review'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function updateReview(reviewId, payload) {
        isLoading.value = true
        error.value = null
        try {
            const data = await reviewService.updateReview(reviewId, payload)
            if (currentReview.value && currentReview.value.id === reviewId) {
                currentReview.value = data
            }
            return data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao atualizar review'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function deleteReview(reviewId) {
        isLoading.value = true
        error.value = null
        try {
            await reviewService.deleteReview(reviewId)
            if (currentReview.value && currentReview.value.id === reviewId) {
                currentReview.value = null
            }
            return true
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao deletar review'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        currentReview,
        isLoading,
        error,
        createReview,
        fetchReview,
        updateReview,
        deleteReview
    }
})
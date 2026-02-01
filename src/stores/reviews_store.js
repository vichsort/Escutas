import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api_service'

export const useReviewStore = defineStore('reviews', () => {
    const recentReviews = ref([])
    const isLoading = ref(false)

    async function fetchRecentReviews() {
        try {
            isLoading.value = true
            const response = await api.get('/reviews/history', {
                params: { page: 1, per_page: 5 }
            })
            recentReviews.value = response.data.items || response.data.data || []
        } catch (error) {
            console.error('Erro ao buscar reviews recentes:', error)
        } finally {
            isLoading.value = false
        }
    }

    return {
        recentReviews,
        isLoading,
        fetchRecentReviews
    }
})
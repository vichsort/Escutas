import api from '@/services/api_service'

class ReviewService {
    async createReview(payload) {
        const response = await api.post('/reviews', payload)
        return response.data
    }
    async getHistory(params = {}) {
        const response = await api.get('/reviews/history', { params })
        return response.data
    }
}

export default new ReviewService()
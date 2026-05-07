import api from '@/services/api_service'

class ReviewService {
    async createReview(payload) {
        const response = await api.post('/reviews', payload)
        return response.data.data 
    }

    async getReviewById(reviewId) {
        const response = await api.get(`/reviews/${reviewId}`)
        return response.data.data 
    }

    async updateReview(reviewId, payload) {
        const response = await api.put(`/reviews/${reviewId}`, payload)
        return response.data.data
    }

    async deleteReview(reviewId) {
        const response = await api.delete(`/reviews/${reviewId}`)
        return response.data
    }
}

export default new ReviewService()
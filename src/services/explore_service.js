import api from '@/services/api_service'

class ExploreService {
    async getTrendingAlbums() {
        const response = await api.get('/explore/trending')
        return response.data.data
    }

    async getHallOfFame() {
        const response = await api.get('/explore/hall-of-fame')
        return response.data.data
    }

    async getGlobalFeed() {
        const response = await api.get('/explore/feed')
        return response.data.data
    }

    async getTopReviewers() {
        const response = await api.get('/explore/top-reviewers')
        return response.data.data
    }
}

export default new ExploreService()
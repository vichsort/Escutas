import api from '@/services/api_service'

class UserService {
    async searchUsers(query) {
        if (!query || query.length < 2) return []
        const response = await api.get('/users/search', { params: { q: query } })
        return response.data.data
    }

    async getProfile(userParam) {
        const response = await api.get(`/users/${userParam}`)
        return response.data.data
    }

    async getUserReviews(userParam, params = {}) {
        // params pode conter: page, per_page, e outros filtros do seu ReviewHistoryQuery
        const response = await api.get(`/users/${userParam}/reviews`, { params })
        return response.data // Retorna o objeto paginado completo (data, total, pages, etc.)
    }

    async getUserCalendar(userParam, month, year) {
        const response = await api.get(`/users/${userParam}/calendar`, { 
            params: { month, year } 
        })
        return response.data.data
    }

    async getUserPlatinums(userParam) {
        const response = await api.get(`/users/${userParam}/platinums`)
        return response.data.data
    }

    async getUserStats(userParam) {
        const response = await api.get(`/users/${userParam}/stats`)
        return response.data.data
    }

    async getMonthlyTitle(userParam, month, year) {
        const response = await api.get(`/users/${userParam}/monthly-title`, { 
            params: { month, year } 
        })
        return response.data.data
    }
}

export default new UserService()
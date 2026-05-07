import api from '@/services/api_service'

class MeService {
    async getProfile() {
        const response = await api.get('/me')
        return response.data.data
    }

    async getNowPlaying() {
        const response = await api.get('/me/now-playing')
        return response.data.data
    }

    async getSuggestions() {
        const response = await api.get('/me/suggestions')
        return response.data.data
    }

    async setMonthlyTitle(payload) {
        // payload esperado: { month, year, title }
        const response = await api.post('/me/monthly-title', payload)
        return response.data.data
    }

    async generateMonthlyTitle(payload) {
        // payload esperado: { month, year }
        const response = await api.post('/me/monthly-title/generate', payload)
        return response.data.data
    }
}

export default new MeService()
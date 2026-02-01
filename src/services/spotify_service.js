import api from '@/services/api_service'

class SpotifyService {
    async getSuggestions() {
        const response = await api.get('/spotify/suggestions')
        return response.data.data
    }

    async getNowPlaying() {
        const response = await api.get('/spotify/now-playing')
        return response.data.data
    }
}

export default new SpotifyService()
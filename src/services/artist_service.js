import api from '@/services/api_service'

class ArtistService {
    async getPlatinumProgress(artistId) {
        const response = await api.get(`/artists/${artistId}/progress`)
        return response.data.data
    }

    async searchArtists(query) {
        if (!query || query.length < 2) return []
        const response = await api.get('/artists/search', { params: { q: query } })
        return response.data.data
    }

    async getArtistDiscography(artistId) {
        const response = await api.get(`/artists/${artistId}/discography`)
        return response.data.data
    }
}

export default new ArtistService()
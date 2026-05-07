import api from '@/services/api_service'

class AlbumService {
    async searchAlbums(query) {
        if (!query) return []
        const response = await api.get('/albums/search', { params: { q: query } })
        return response.data.data
    }

    async getAlbumDetails(spotifyId) {
        const response = await api.get(`/albums/${spotifyId}`)
        return response.data.data
    }

    async curateAlbum(spotifyId, isCanonical) {
        const response = await api.post(`/albums/${spotifyId}/curate`, { is_canonical: isCanonical })
        return response.data
    }
}

export default new AlbumService()
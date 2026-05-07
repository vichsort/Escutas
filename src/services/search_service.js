import api from '@/services/api_service'

class SearchService {
    async quickSearch(query, limit = 3) {
        // Bloqueio preventivo no front para poupar rede (espelhando o back)
        if (!query || query.length < 2) return []
        
        const response = await api.get('/search', { 
            params: { q: query, limit } 
        })
        
        return response.data.data
    }
}

export default new SearchService()
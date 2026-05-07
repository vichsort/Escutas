import api from '@/services/api_service'

class InteractionService {
    async createComment(payload) {
        // payload: { target_id, target_type, content }
        const response = await api.post('/interactions/comment', payload)
        return response.data.data
    }

    async getComments(targetType, targetId, page = 1, perPage = 10) {
        const response = await api.get(`/interactions/${targetType}/${targetId}/comments`, {
            params: { page, per_page: perPage }
        })
        return response.data // Retorna o objeto paginado
    }

    async deleteComment(commentId) {
        const response = await api.delete(`/interactions/comment/${commentId}`)
        return response.data
    }

    async toggleVote(payload) {
        // payload: { target_id, target_type, value: 1 ou -1 }
        const response = await api.post('/interactions/vote', payload)
        return response.data.data // Retorna { action: "added|removed", counts: {...} }
    }

    async getVotes(targetType, targetId) {
        const response = await api.get(`/interactions/${targetType}/${targetId}/votes`)
        return response.data.data // Retorna o dicionário de counts
    }
}

export default new InteractionService()
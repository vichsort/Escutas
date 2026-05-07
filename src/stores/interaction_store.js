import { defineStore } from 'pinia'
import { ref } from 'vue'
import interactionService from '@/services/interaction_service'

export const useInteractionStore = defineStore('interactions', () => {
    const currentComments = ref({
        items: [],
        page: 1,
        per_page: 10,
        total: 0,
        has_next: false
    })

    // Estado de Votos (Mapeado por ID para funcionar bem em listas/feeds)
    // Ex: { "uuid-da-review-1": { upvotes: 10, downvotes: 2, total: 8 }, ... }
    const voteCounts = ref({})

    const isLoading = ref({
        comments: false,
        action: false
    })
    const error = ref(null)

    async function fetchComments(targetType, targetId, page = 1, perPage = 10, reset = false) {
        if (reset) {
            currentComments.value.items = []
        }
        
        isLoading.value.comments = true
        error.value = null
        try {
            const data = await interactionService.getComments(targetType, targetId, page, perPage)
            
            const newItems = data.items || data.data || []
            if (reset) {
                currentComments.value.items = newItems
            } else {
                currentComments.value.items = [...currentComments.value.items, ...newItems]
            }
            
            currentComments.value.page = page
            currentComments.value.per_page = perPage
            currentComments.value.total = data.total_items || data.total || currentComments.value.items.length
            currentComments.value.has_next = page < (data.total_pages || data.pages || 1)
        } catch (err) {
            console.error('Erro ao buscar comentários:', err)
            error.value = 'Falha ao carregar comentários.'
        } finally {
            isLoading.value.comments = false
        }
    }

    async function addComment(payload) {
        isLoading.value.action = true
        error.value = null
        try {
            const newComment = await interactionService.createComment(payload)
            currentComments.value.items.unshift(newComment)
            currentComments.value.total += 1
            return newComment
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao enviar comentário.'
            throw err
        } finally {
            isLoading.value.action = false
        }
    }

    async function removeComment(commentId) {
        isLoading.value.action = true
        error.value = null
        try {
            await interactionService.deleteComment(commentId)
            currentComments.value.items = currentComments.value.items.filter(c => c.id !== commentId)
            currentComments.value.total = Math.max(0, currentComments.value.total - 1)
            return true
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao excluir comentário.'
            throw err
        } finally {
            isLoading.value.action = false
        }
    }

    async function fetchVotes(targetType, targetId) {
        try {
            const counts = await interactionService.getVotes(targetType, targetId)
            // Salva no dicionário global usando o ID do alvo como chave
            voteCounts.value = {
                ...voteCounts.value,
                [targetId]: counts
            }
            return counts
        } catch (err) {
            console.error('Erro ao buscar votos:', err)
        }
    }

    async function toggleVote(targetType, targetId, value) {
        isLoading.value.action = true
        error.value = null
        try {
            const response = await interactionService.toggleVote({
                target_type: targetType,
                target_id: targetId,
                value: value
            })
            voteCounts.value = {
                ...voteCounts.value,
                [targetId]: response.counts
            }
            return response
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao processar voto.'
            throw err
        } finally {
            isLoading.value.action = false
        }
    }

    return {
        currentComments,
        voteCounts,
        isLoading,
        error,
        fetchComments,
        addComment,
        removeComment,
        fetchVotes,
        toggleVote
    }
})
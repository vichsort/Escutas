import { defineStore } from 'pinia'
import { ref } from 'vue'
import wrappedService from '@/services/wrapped_service'
import { useBlogStore } from '@/stores/blog_store'

export const useWrappedStore = defineStore('wrapped', () => {
    const latestWrappedResult = ref(null)
    const isGenerating = ref(false)
    const error = ref(null)

    async function generateWrapped(month = null, year = null) {
        isGenerating.value = true
        error.value = null
        
        try {
            const payload = {}
            if (month) payload.month = month
            if (year) payload.year = year

            const result = await wrappedService.generateMonthlyWrapped(payload)
            latestWrappedResult.value = result.data
            
            // Como o Wrapped cria um rascunho no blog,
            // podemos avisar a blogStore para limpar o cache dela ou recarregar os posts
            const blogStore = useBlogStore()
            // blogStore.fetchPosts(1, 10, true) 

            return result
        } catch (err) {
            console.error('Erro ao gerar Wrapped:', err)
            error.value = err.response?.data?.message || 'Falha ao gerar sua retrospectiva. Tente novamente.'
            throw err
        } finally {
            isGenerating.value = false
        }
    }

    function clearWrappedResult() {
        latestWrappedResult.value = null
        error.value = null
    }

    return {
        latestWrappedResult,
        isGenerating,
        error,
        generateWrapped,
        clearWrappedResult
    }
})
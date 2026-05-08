import { ref, reactive, watch } from 'vue'
import { useUserStore } from '@/stores/users_store'

export function useLibrary() {
    const userStore = useUserStore()

    // dados
    const reviews = ref([])
    const isLoading = ref(true)
    const isLoadingMore = ref(false)

    // paginação
    const pagination = reactive({
        page: 1,
        per_page: 20,
        total: 0,
        has_next: false
    })

    // filtros
    const filters = reactive({
        search: '',
        tier: null,
        genre: null,
        is_private: null,
        sort_by: 'created_at', // Padrão: mais recentes
        sort_order: 'desc'
    })

    // Buscar Dados
    const fetchReviews = async (reset = false) => {
        if (reset) {
            pagination.page = 1
            isLoading.value = true
            reviews.value = []
        } else {
            isLoadingMore.value = true
        }

        try {
            // Limpa os filtros nulos/vazios antes de mandar pra API
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== null && v !== '')
            )

            const params = {
                page: pagination.page,
                per_page: pagination.per_page,
                ...cleanFilters
            }

            await userStore.fetchUserReviews('me', params)

            const responseData = userStore.currentReviews
            if (!responseData) return

            const items = responseData.items || responseData.data || []
            const total = responseData.total_items ?? responseData.meta?.total_items ?? items.length
            const pages = responseData.total_pages ?? responseData.meta?.total_pages ?? responseData.pages ?? 1

            if (reset) {
                reviews.value = items
            } else {
                reviews.value = [...reviews.value, ...items]
            }

            pagination.total = total
            pagination.has_next = pagination.page < pages

        } catch (error) {
            console.error('Erro ao buscar biblioteca:', error)
        } finally {
            isLoading.value = false
            isLoadingMore.value = false
        }
    }

    // Carregar Mais (Paginação)
    const loadMore = () => {
        if (pagination.has_next && !isLoadingMore.value) {
            pagination.page++
            fetchReviews(false)
        }
    }

    // Atualizar Filtros (A UI vai usar isso)
    const updateFilters = (newFilters) => {
        Object.assign(filters, newFilters)
    }

    // ve mudanças nos filtros e dispara a busca com Debounce
    let searchTimeout = null
    watch(filters, () => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            fetchReviews(true)
        }, 300) // 300ms de debounce para não afogar o backend enquanto digita/clica
    }, { deep: true })

    return {
        reviews,
        isLoading,
        isLoadingMore,
        pagination,
        filters,
        fetchReviews,
        loadMore,
        updateFilters
    }
}
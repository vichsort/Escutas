<script setup>
import { ref, onMounted, watch } from 'vue'
import { Search, Loader2, Library } from 'lucide-vue-next'
import ReviewService from '@/services/review_service'
import ReviewCard from '@/components/media/ReviewCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const reviews = ref([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const searchQuery = ref('')
const selectedTier = ref(null)
const pagination = ref({
    page: 1,
    per_page: 20,
    total: 0,
    has_next: false
})

let searchTimeout = null

const filters = [
    { label: 'Todos', value: null },
    { label: '👑 Masterpiece', value: 'S' },
    { label: '🔥 Ótimos', value: 'A' },
    { label: '😐 Médios', value: 'B' },
    { label: '💀 Ruins', value: 'C' },
]

const fetchReviews = async (reset = false) => {
    if (reset) {
        pagination.value.page = 1
        isLoading.value = true
    } else {
        isLoadingMore.value = true
    }

    try {
        const params = {
            page: pagination.value.page,
            per_page: pagination.value.per_page,
            search: searchQuery.value,
            tier: selectedTier.value
        }

        const responseData = await ReviewService.getHistory(params)

        const items = responseData.items || responseData.data?.items || responseData.data || []

        const total = responseData.meta?.total_items !== undefined ? responseData.meta.total_items :
            (responseData.total !== undefined ? responseData.total : items.length)

        const pages = responseData.meta?.total_pages || responseData.pages || 1

        if (reset) {
            reviews.value = items
        } else {
            reviews.value = [...reviews.value, ...items]
        }

        pagination.value.total = total
        pagination.value.has_next = pagination.value.page < pages

    } catch (error) {
        console.error('Erro ao buscar biblioteca:', error)
    } finally {
        isLoading.value = false
        isLoadingMore.value = false
    }
}

const loadMore = () => {
    if (pagination.value.has_next) {
        pagination.value.page++
        fetchReviews(false)
    }
}

watch(searchQuery, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        fetchReviews(true)
    }, 250)
})

const selectFilter = (value) => {
    selectedTier.value = value
    fetchReviews(true)
}

onMounted(() => {
    fetchReviews(true)
})
</script>

<template>
    <div class="p-8 pb-24 max-w-7xl mx-auto space-y-8">

        <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Library class="text-primary" />
                    Sua Biblioteca
                </h1>
                <p class="text-gray-500 dark:text-gray-400 mt-2">
                    Você já avaliou <span class="font-bold text-gray-900 dark:text-white">{{ pagination.total }}</span>
                    álbuns.
                </p>
            </div>

            <div class="w-full md:w-80">
                <BaseInput v-model="searchQuery" placeholder="Buscar álbum ou artista...">
                    <template #prefix>
                        <Search :size="18" class="text-gray-400" />
                    </template>
                </BaseInput>
            </div>
        </header>

        <div class="flex flex-wrap gap-2 pb-2">
            <button v-for="filter in filters" :key="filter.label" @click="selectFilter(filter.value)"
                class="px-4 py-1.5 rounded-full text-sm font-bold transition-all border"
                :class="selectedTier === filter.value
                    ? 'bg-primary border-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary/50'">
                {{ filter.label }}
            </button>
        </div>

        <section>

            <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <div v-for="i in 10" :key="i" class="space-y-3">
                    <div class="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
            </div>

            <div v-else-if="reviews.length === 0"
                class="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
                <Library :size="64" class="mb-4 text-gray-300 dark:text-gray-700" />
                <p v-if="searchQuery">Nenhum resultado para "{{ searchQuery }}"</p>
                <p v-else>Sua biblioteca está vazia. Vá em "Explorar" para começar!</p>
            </div>

            <div v-else
                class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4">
                <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
            </div>

            <div v-if="pagination.has_next" class="flex justify-center mt-12">
                <BaseButton variant="outline" @click="loadMore" :disabled="isLoadingMore" class="min-w-[200px]">
                    <Loader2 v-if="isLoadingMore" class="animate-spin mr-2" :size="20" />
                    {{ isLoadingMore ? 'Carregando...' : 'Carregar Mais' }}
                </BaseButton>
            </div>

        </section>

    </div>
</template>
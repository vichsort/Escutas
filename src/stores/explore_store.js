import { defineStore } from 'pinia'
import { ref } from 'vue'
import exploreService from '@/services/explore_service'

export const useExploreStore = defineStore('explore', () => {
    const trendingAlbums = ref([])
    const hallOfFame = ref([])
    const globalFeed = ref([])
    const topReviewers = ref([])

    const isLoading = ref({
        trending: false,
        fame: false,
        feed: false,
        reviewers: false
    })
    const error = ref(null)

    async function fetchTrending() {
        isLoading.value.trending = true
        try {
            trendingAlbums.value = await exploreService.getTrendingAlbums()
        } catch (err) {
            console.error('Erro ao buscar trending:', err)
            error.value = 'Falha ao carregar álbuns em alta.'
        } finally {
            isLoading.value.trending = false
        }
    }

    async function fetchHallOfFame() {
        isLoading.value.fame = true
        try {
            hallOfFame.value = await exploreService.getHallOfFame()
        } catch (err) {
            console.error('Erro ao buscar hall of fame:', err)
        } finally {
            isLoading.value.fame = false
        }
    }

    async function fetchGlobalFeed() {
        isLoading.value.feed = true
        try {
            globalFeed.value = await exploreService.getGlobalFeed()
        } catch (err) {
            console.error('Erro ao buscar feed global:', err)
        } finally {
            isLoading.value.feed = false
        }
    }

    async function fetchTopReviewers() {
        isLoading.value.reviewers = true
        try {
            topReviewers.value = await exploreService.getTopReviewers()
        } catch (err) {
            console.error('Erro ao buscar top reviewers:', err)
        } finally {
            isLoading.value.reviewers = false
        }
    }

    async function fetchExploreDashboard() {
        await Promise.allSettled([
            fetchTrending(),
            fetchHallOfFame(),
            fetchGlobalFeed(),
            fetchTopReviewers()
        ])
    }

    return {
        trendingAlbums,
        hallOfFame,
        globalFeed,
        topReviewers,
        isLoading,
        error,
        fetchTrending,
        fetchHallOfFame,
        fetchGlobalFeed,
        fetchTopReviewers,
        fetchExploreDashboard
    }
})
// src/stores/users_store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import userService from '@/services/user_service'

export const useUserStore = defineStore('users', () => {
    const searchResults = ref([])
    const currentProfile = ref(null)
    const currentReviews = ref(null)
    const currentCalendar = ref(null)
    const currentPlatinums = ref([])
    const currentStats = ref(null)
    const currentMonthlyTitle = ref(null)

    const isLoading = ref({
        profile: false,
        reviews: false,
        calendar: false,
        platinums: false,
        stats: false,
        monthlyTitle: false
    })
    const error = ref(null)

    async function search(query) {
        if (!query || query.length < 2) {
            searchResults.value = []
            return
        }
        try {
            searchResults.value = await userService.searchUsers(query)
        } catch (err) {
            console.error('Erro na busca de usuários:', err)
            searchResults.value = []
        }
    }

    async function fetchProfile(userParam) {
        isLoading.value.profile = true
        error.value = null
        try {
            currentProfile.value = await userService.getProfile(userParam)
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar perfil'
        } finally {
            isLoading.value.profile = false
        }
    }

    async function fetchUserReviews(userParam, params = { page: 1, per_page: 10 }) {
        isLoading.value.reviews = true
        try {
            currentReviews.value = await userService.getUserReviews(userParam, params)
        } catch (err) {
            console.error('Erro ao buscar reviews do usuário:', err)
        } finally {
            isLoading.value.reviews = false
        }
    }

    async function fetchUserCalendar(userParam, month, year) {
        isLoading.value.calendar = true
        try {
            currentCalendar.value = await userService.getUserCalendar(userParam, month, year)
        } catch (err) {
            console.error('Erro ao buscar calendário:', err)
        } finally {
            isLoading.value.calendar = false
        }
    }

    async function fetchUserPlatinums(userParam) {
        isLoading.value.platinums = true
        try {
            currentPlatinums.value = await userService.getUserPlatinums(userParam)
        } catch (err) {
            console.error('Erro ao buscar platinas:', err)
        } finally {
            isLoading.value.platinums = false
        }
    }

    async function fetchUserStats(userParam) {
        isLoading.value.stats = true
        try {
            currentStats.value = await userService.getUserStats(userParam)
        } catch (err) {
            console.error('Erro ao buscar estatísticas:', err)
        } finally {
            isLoading.value.stats = false
        }
    }

    async function fetchMonthlyTitle(userParam, month, year) {
        isLoading.value.monthlyTitle = true
        try {
            currentMonthlyTitle.value = await userService.getMonthlyTitle(userParam, month, year)
        } catch (err) {
            console.error('Erro ao buscar título mensal:', err)
            currentMonthlyTitle.value = null
        } finally {
            isLoading.value.monthlyTitle = false
        }
    }

    async function fetchFullDashboard(userParam, month, year) {
        await Promise.allSettled([
            fetchProfile(userParam),
            fetchUserStats(userParam),
            fetchUserPlatinums(userParam),
            fetchUserCalendar(userParam, month, year),
            fetchMonthlyTitle(userParam, month, year)
        ])
    }

    return {
        searchResults, 
        currentProfile, 
        currentReviews, 
        currentCalendar,
        currentPlatinums, 
        currentStats, 
        currentMonthlyTitle, 
        isLoading, 
        error,
        search, 
        fetchProfile, 
        fetchUserReviews, 
        fetchUserCalendar,
        fetchUserPlatinums, 
        fetchUserStats, 
        fetchMonthlyTitle, 
        fetchFullDashboard
    }
})
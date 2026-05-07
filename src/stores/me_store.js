import { defineStore } from 'pinia'
import { ref } from 'vue'
import meService from '@/services/me_service'

export const useMeStore = defineStore('me', () => {
    const profile = ref(null)
    const nowPlaying = ref(null)
    const suggestions = ref([])
    const isLoading = ref(false)
    const isGeneratingTitle = ref(false)
    const error = ref(null)

    async function fetchProfile() {
        isLoading.value = true
        error.value = null
        try {
            profile.value = await meService.getProfile()
            return profile.value
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao carregar perfil.'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function fetchNowPlaying() {
        try {
            nowPlaying.value = await meService.getNowPlaying()
        } catch (err) {
            console.error('Erro ao buscar o que está tocando:', err)
            nowPlaying.value = null
        }
    }

    async function fetchSuggestions() {
        isLoading.value = true
        try {
            suggestions.value = await meService.getSuggestions()
        } catch (err) {
            console.error('Erro ao buscar sugestões:', err)
            suggestions.value = []
        } finally {
            isLoading.value = false
        }
    }

    async function updateMonthlyTitle(month, year, title) {
        try {
            const data = await meService.setMonthlyTitle({ month, year, title })
            await fetchProfile()
            return data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao atualizar título.'
            throw err
        }
    }

    async function generateTitle(month, year) {
        isGeneratingTitle.value = true
        error.value = null
        try {
            const data = await meService.generateMonthlyTitle({ month, year })
            await fetchProfile() // Sincroniza o perfil com o novo título gerado
            return data
        } catch (err) {
            error.value = err.response?.data?.message || 'Erro ao gerar título.'
            throw err
        } finally {
            isGeneratingTitle.value = false
        }
    }

    return { 
        profile, 
        nowPlaying, 
        suggestions, 
        isLoading, 
        isGeneratingTitle,
        error,
        fetchProfile, 
        fetchNowPlaying, 
        fetchSuggestions,
        updateMonthlyTitle,
        generateTitle
    }
})
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api_service'

const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL || 'http://127.0.0.1:5173/auth/callback';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('escutas_user')) || null)
    const token = ref(localStorage.getItem('escutas_token'))

    const isAuthenticated = computed(() => !!token.value)

    async function loginWithSpotify() {
        try {
            const redirectUri = REDIRECT_URL
            const response = await api.get(`/auth/spotify-url?redirect_uri=${redirectUri}`)
            window.location.href = response.data.url
        } catch (error) {
            console.error('Erro ao iniciar login:', error)
            alert('Erro ao conectar com servidor.')
        }
    }

    async function handleCallback(code) {
        try {
            const response = await api.get(`/auth/callback?code=${code}`)

            const { access_token, user: userData } = response.data.data

            token.value = access_token
            user.value = userData
            
            localStorage.setItem('escutas_token', access_token)
            localStorage.setItem('escutas_user', JSON.stringify(userData))
            api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
            
            return true
        } catch (error) {
            console.error('Erro no callback de login:', error)
            logout()
            return false
        }
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('escutas_token')
        localStorage.removeItem('escutas_user')
        delete api.defaults.headers.common['Authorization']
        window.location.href = '/'
    }

    return { 
        user, 
        token, 
        isAuthenticated, 
        loginWithSpotify, 
        handleCallback, 
        logout 
    }
})
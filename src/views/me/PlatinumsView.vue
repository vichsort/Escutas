<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users_store'
import { useAuthStore } from '@/stores/auth_store'
import PlatinumArtistCard from '@/components/me/PlatinumArtistCard.vue'
import { ChevronLeft, Trophy } from 'lucide-vue-next'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
    userStore.fetchUserPlatinums(authStore.user.id)
})
</script>

<template>
    <div class="max-w-2xl mx-auto px-4 py-10 space-y-6">

        <button
            @click="router.back()"
            class="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit -ml-1"
        >
            <ChevronLeft :size="18" />
            Voltar
        </button>

        <div class="flex items-center gap-2">
            <Trophy :size="20" class="text-primary" />
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Platinas</h1>
            <span class="text-sm text-gray-400">({{ userStore.currentPlatinums.length }})</span>
        </div>

        <div v-if="userStore.isLoading.platinums" class="flex items-center justify-center py-20">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-organic-spin" />
        </div>

        <div v-else-if="userStore.currentPlatinums.length" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
            <PlatinumArtistCard
                v-for="artist in userStore.currentPlatinums"
                :key="artist.spotify_artist_id"
                :artist="artist"
                @click="router.push({ name: 'artist', params: { id: artist.spotify_artist_id } })"
            />
        </div>

        <p v-else class="text-sm text-gray-400 italic">
            Nenhuma platina ainda.
        </p>

    </div>
</template>
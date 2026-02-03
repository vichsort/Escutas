<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Home, BookOpen, Search, Library, Music2, Headphones } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth_store'
import { useReviewStore } from '@/stores/reviews_store'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import LogoutModal from '@/components/auth/LogoutModal.vue'

const authStore = useAuthStore()
const reviewStore = useReviewStore()
const isLoginModalOpen = ref(false)
const isLogoutModalOpen = ref(false)

onMounted(() => {
    if (authStore.user) {
        reviewStore.fetchRecentReviews()
    }
})

watch(() => authStore.user, (newUser) => {
    if (newUser) {
        reviewStore.fetchRecentReviews()
    } else {
        reviewStore.recentReviews = []
    }
})

const handleLoginConfirm = () => {
    isLoginModalOpen.value = false
    authStore.loginWithSpotify()
}

const handleLogoutConfirm = () => {
    isLogoutModalOpen.value = false
    authStore.logout()
}
</script>

<template>
    <aside
        class="w-64 flex-shrink-0 flex flex-col bg-surface-light dark:bg-black border-r border-gray-200 dark:border-gray-800 h-full transition-colors duration-300">

        <div class="p-6 flex items-center gap-3">
            <div
                class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Headphones :size="18" fill="currentColor" />
            </div>
            <h1 class="text-xl font-bold tracking-tighter text-gray-900 dark:text-white">Escutas</h1>
        </div>

        <nav class="flex-1 px-3 space-y-1">
            <RouterLink to="/" active-class="bg-primary/10 text-primary font-bold dark:bg-primary/20" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                       text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10">
                <Home :size="20" />
                Início
            </RouterLink>

            <RouterLink to="/reviews" active-class="bg-primary/10 text-primary font-bold dark:bg-primary/20" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                       text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10">
                <Search :size="20" />
                Explorar
            </RouterLink>

            <RouterLink v-if="authStore.user" to="/library"
                active-class="bg-primary/10 text-primary font-bold dark:bg-primary/20" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                       text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10">
                <Library :size="20" />
                Sua Biblioteca
            </RouterLink>

            <RouterLink to="/blog" active-class="bg-primary/10 text-primary font-bold dark:bg-primary/20" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 
                       text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10">
                <BookOpen :size="20" />
                Blog
            </RouterLink>
        </nav>

        <div class="px-6 py-4 mt-4 flex-1 overflow-hidden flex flex-col min-h-0">
            <div class="flex items-center justify-between mb-3 group cursor-pointer px-2">
                <h3
                    class="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-primary transition-colors">
                    Recentes
                </h3>
            </div>

            <div class="overflow-y-auto custom-scrollbar pr-2 space-y-1 pb-4">

                <template v-if="authStore.user">

                    <div v-if="reviewStore.isLoading" class="space-y-2">
                        <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-2 rounded-lg">
                            <div class="w-8 h-8 rounded bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0"></div>
                            <div class="flex-1 space-y-1.5 min-w-0">
                                <div class="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                                <div class="h-2 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="reviewStore.recentReviews.length > 0">
                        <RouterLink v-for="review in reviewStore.recentReviews" :key="review.id"
                            :to="`/reviews/${review.id}`"
                            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer transition-colors group">
                            <img :src="review.cover"
                                class="w-8 h-8 rounded bg-gray-800 object-cover opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                                alt="Capa" />
                            <div class="overflow-hidden min-w-0">
                                <p
                                    class="text-sm font-medium truncate text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                                    {{ review.album_name }}
                                </p>
                                <p class="text-xs text-gray-500 truncate">{{ review.artist_name }}</p>
                            </div>
                        </RouterLink>
                    </div>

                    <div v-else class="text-xs text-gray-500 text-center py-8 italic opacity-70">
                        Nenhuma review recente.
                    </div>
                </template>

                <div v-else
                    class="text-xs text-gray-500 text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-white/5 px-4">
                    <Music2 :size="24" class="mx-auto mb-2 opacity-50" />
                    Faça login para ver seu histórico
                </div>

            </div>
        </div>

        <div class="p-4 border-t border-gray-200 dark:border-gray-800">
            <div v-if="authStore.user"
                class="flex items-center gap-3 bg-gray-100 dark:bg-white/5 p-2 rounded-xl transition-colors hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer group">
                <img :src="authStore.user.avatar_url || `https://ui-avatars.com/api/?name=${authStore.user.display_name}&background=1DB954&color=fff`"
                    class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 group-hover:border-primary transition-colors"
                    alt="Avatar" />
                <div class="overflow-hidden flex-1">
                    <p class="text-xs font-bold truncate text-gray-900 dark:text-white">{{ authStore.user.display_name
                        }}</p>
                    <button @click.stop="isLogoutModalOpen = true"
                        class="text-[10px] text-red-500 hover:text-red-400 font-medium uppercase tracking-wide hover:underline">
                        Sair
                    </button>
                </div>
            </div>

            <div v-else>
                <BaseButton block @click="isLoginModalOpen = true" class="shadow-md shadow-primary/20">
                    Entrar
                </BaseButton>
            </div>
        </div>


        <LoginModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" @confirm="handleLoginConfirm" />

        <LogoutModal :is-open="isLogoutModalOpen" @close="isLogoutModalOpen = false" @confirm="handleLogoutConfirm" />
    </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #333;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
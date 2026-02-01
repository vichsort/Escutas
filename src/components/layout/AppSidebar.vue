<script setup>
import { RouterLink } from 'vue-router'
import { Home, BookOpen, PlusCircle, Search } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth_store'
import BaseButton from '@/components/ui/BaseButton.vue'

const authStore = useAuthStore()
</script>

<template>
    <aside
        class="w-64 flex-shrink-0 flex flex-col bg-surface-light dark:bg-black border-r border-gray-200 dark:border-gray-800 h-full transition-colors duration-300">

        <div class="p-6">
            <h1 class="text-2xl font-bold tracking-tighter text-primary">Escutas</h1>
        </div>

        <nav class="flex-1 px-3 space-y-1">
            <RouterLink to="/"
                class="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200"
                active-class="bg-primary/10 text-primary font-bold dark:bg-primary/20"
                class-inactive="text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
                <Home :size="20" />
                Início
            </RouterLink>

            <RouterLink to="/reviews"
                class="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                active-class="bg-primary/10 text-primary font-bold dark:bg-primary/20 !text-primary">
                <Search :size="20" /> Explorar
            </RouterLink>

            <RouterLink to="/blog"
                class="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
                active-class="bg-primary/10 text-primary font-bold dark:bg-primary/20 !text-primary">
                <BookOpen :size="20" />
                Blog
            </RouterLink>
        </nav>

        <div class="px-6 py-4 mt-4">
            <div class="flex items-center justify-between mb-2 group cursor-pointer">
                <h3
                    class="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">
                    Suas Reviews
                </h3>
                <PlusCircle :size="16" class="text-gray-400 hover:text-white transition-colors" />
            </div>

            <div class="h-48 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                <div
                    class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                    <div class="w-10 h-10 rounded bg-gray-300 dark:bg-gray-800 flex-shrink-0"></div>
                    <div class="overflow-hidden">
                        <p class="text-sm font-medium truncate">Dark Side of the Moon</p>
                        <p class="text-xs text-gray-500 truncate">Pink Floyd</p>
                    </div>
                </div>

                <div class="text-xs text-gray-500 text-center py-4">
                    Faça login para ver suas reviews
                </div>
            </div>
        </div>

        <div class="p-4 border-t border-gray-200 dark:border-gray-800">

            <div v-if="authStore.user" class="flex items-center gap-3">
                <img :src="authStore.user.avatar_url || 'https://via.placeholder.com/40'"
                    class="w-10 h-10 rounded-full border-2 border-primary" alt="Avatar" />
                <div class="overflow-hidden">
                    <p class="text-sm font-bold truncate">{{ authStore.user.display_name }}</p>
                    <button @click="authStore.logout" class="text-xs text-red-500 hover:underline">Sair</button>
                </div>
            </div>

            <div v-else>
                <BaseButton block @click="authStore.loginWithSpotify">
                    Entrar com Spotify
                </BaseButton>
            </div>

        </div>

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
    background: #555;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #888;
}
</style>
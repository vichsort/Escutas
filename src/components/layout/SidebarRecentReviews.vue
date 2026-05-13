<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Music2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth_store'
import { useUserStore } from '@/stores/users_store'

const props = defineProps({
    isExpanded: {
        type: Boolean,
        required: true
    }
})

const route = useRoute()
const authStore = useAuthStore()
const userStore = useUserStore()

const recentReviews = computed(() => {
    return userStore.currentReviews?.items || userStore.currentReviews?.data || []
})
const isLoading = computed(() => userStore.isLoading.reviews)

const fetchSidebarReviews = () => {
    userStore.fetchUserReviews('me', { page: 1, per_page: 5 })
}

onMounted(() => {
    if (authStore.user) {
        fetchSidebarReviews()
    }
})

watch(() => authStore.user, (newUser) => {
    if (newUser) {
        fetchSidebarReviews()
    } else {
        userStore.currentReviews = null
    }
})
</script>

<template>
    <div class="flex-1 overflow-hidden flex flex-col min-h-0">

        <div class="mb-3 px-2 flex justify-center" :class="isExpanded ? 'justify-between items-center' : ''">
            <h3 v-if="isExpanded" class="text-xs font-bold text-gray-400 uppercase tracking-wider transition-colors">
                Recentes
            </h3>
            <div v-else class="w-8 border-t border-gray-300 dark:border-gray-700 mt-2 rounded"></div>
        </div>

        <div class="overflow-y-auto custom-scrollbar space-y-1 pb-4" :class="isExpanded ? 'pr-2' : 'px-0'">

            <template v-if="authStore.user">
                <div v-if="isLoading" class="space-y-2">
                    <div v-for="i in 3" :key="i" class="flex items-center rounded-lg"
                        :class="isExpanded ? 'gap-3 p-2' : 'justify-center py-2'">
                        <div class="w-8 h-8 rounded bg-gray-200 dark:bg-gray-800 animate-pulse flex-shrink-0"></div>
                        <div v-if="isExpanded" class="flex-1 space-y-1.5 min-w-0">
                            <div class="h-3 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                            <div class="h-2 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div v-else-if="recentReviews.length > 0">
                    <RouterLink v-for="review in recentReviews" :key="review.id" :to="`/reviews/${review.id}`"
                        class="flex items-center rounded-lg cursor-pointer transition-colors group border border-transparent"
                        :class="[
                            isExpanded ? 'gap-3 p-2 hover:bg-gray-200 dark:hover:bg-white/10' : 'justify-center py-2',
                            route.params.id === review.id ? 'bg-primary/10 border-primary/20' : ''
                        ]" :title="!isExpanded ? `${review.album_name} - ${review.artist_name}` : ''">
                        <img :src="review.cover_url || 'https://placehold.co/100?text=CD'"
                            class="w-8 h-8 rounded bg-gray-800 object-cover transition-opacity shadow-sm" :class="[
                                route.params.id === review.id ? 'opacity-100 ring-2 ring-primary' : 'opacity-100',
                                isExpanded && route.params.id !== review.id ? 'opacity-80 group-hover:opacity-100' : ''
                            ]" alt="Capa" />

                        <div v-if="isExpanded" class="overflow-hidden min-w-0">
                            <p class="text-sm font-medium truncate transition-colors"
                                :class="route.params.id === review.id ? 'text-primary font-bold' : 'text-gray-700 dark:text-gray-300 group-hover:text-primary'">
                                {{ review.album_name }}
                            </p>
                            <p class="text-xs text-gray-500 truncate">{{ review.artist_name }}</p>
                        </div>
                    </RouterLink>
                </div>

                <div v-else class="text-xs text-gray-500 text-center py-8 italic opacity-70">
                    <span v-if="isExpanded">Nenhuma review recente.</span>
                    <Music2 v-else :size="20" class="mx-auto opacity-50" />
                </div>
            </template>

            <div v-else
                class="text-xs text-gray-500 text-center border-dashed border-gray-300 dark:border-gray-700 rounded-xl"
                :class="isExpanded ? 'py-8 border bg-gray-50 dark:bg-white/5 px-4 mx-2' : 'py-4 border-none bg-transparent'">
                <Music2 :size="isExpanded ? 24 : 20" class="mx-auto opacity-50" :class="isExpanded ? 'mb-2' : ''" />
                <span v-if="isExpanded">Faça login para ver seu histórico</span>
            </div>

        </div>
    </div>
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
<script setup>
import { computed } from 'vue'
import { Crown, Skull } from 'lucide-vue-next'

const props = defineProps({
    review: {
        type: Object,
        required: true
    }
})

const displayScore = computed(() => {
    return props.review.average_score
        ? parseFloat(props.review.average_score).toFixed(1)
        : '?'
})

const badgeConfig = computed(() => {
    const score = parseFloat(displayScore.value)

    if (score >= 9.5) return { color: 'bg-yellow-400 text-black', icon: Crown }
    if (score >= 8.0) return { color: 'bg-green-500 text-white', icon: null }
    if (score >= 6.0) return { color: 'bg-blue-500 text-white', icon: null }
    if (score >= 3.0) return { color: 'bg-orange-500 text-white', icon: null }
    return { color: 'bg-red-600 text-white', icon: Skull }
})
</script>

<template>
    <div class="group relative flex flex-col gap-3 w-full cursor-pointer">

        <div
            class="relative aspect-square overflow-hidden rounded-xl shadow-sm group-hover:shadow-xl transition-all duration-300">
            <img :src="review.cover || 'https://placehold.co/400x400?text=Sem+Capa'" :alt="review.album_name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy" @error="$event.target.src = 'https://placehold.co/400x400?text=Erro'" />

            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>

            <div class="absolute top-2 right-2 px-2 py-1 rounded-lg font-bold text-xs shadow-lg flex items-center gap-1"
                :class="badgeConfig.color">
                <component :is="badgeConfig.icon" v-if="badgeConfig.icon" :size="12" fill="currentColor" />
                {{ displayScore }}
            </div>
        </div>

        <div class="flex flex-col">
            <h3 class="font-bold text-gray-900 dark:text-white truncate" :title="review.album_name">
                {{ review.album_name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ review.artist_name }}
            </p>
        </div>

    </div>
</template>
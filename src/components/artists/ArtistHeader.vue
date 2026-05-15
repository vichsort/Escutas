<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, Trophy } from 'lucide-vue-next'

const props = defineProps({
    artist: { type: Object, required: true },
    stats: { type: Object, required: true }
})

const router = useRouter()

const genres = computed(() => props.artist.genres?.length ? props.artist.genres.slice(0, 3) : [])

const progressLabel = computed(() =>
    `${props.stats.completed_count} de ${props.stats.total_required} álbuns · ${props.stats.percentage}%`
)
</script>

<template>
    <div class="flex flex-col gap-4 pb-8 border-b border-gray-200 dark:border-gray-800/50">

        <button @click="router.back()"
            class="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit -ml-1">
            <ChevronLeft :size="18" />
            Voltar
        </button>

        <span class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Artista
        </span>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div class="flex items-center gap-5">
                <img v-if="artist.image_url" :src="artist.image_url" :alt="artist.name"
                    class="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0" />
                <h1
                    class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                    {{ artist.name }}
                </h1>
            </div>

            <div v-if="stats.is_platinum" class="flex items-center gap-2 md:pb-1 flex-shrink-0">
                <Trophy :size="18" class="text-primary" />
                <span class="text-sm font-bold uppercase tracking-widest text-primary">Platina</span>
            </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap mt-1">
            <template v-if="genres.length">
                <span v-for="genre in genres" :key="genre"
                    class="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                    {{ genre }}
                </span>
                <span class="text-gray-400 dark:text-gray-600 mx-1">·</span>
            </template>
            <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ stats.total_required }} álbuns na discografia
            </span>
        </div>

        <div class="mt-2 space-y-1.5">
            <div class="h-1.5 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div class="h-full rounded-full bg-primary transition-all duration-700"
                    :style="{ width: `${stats.percentage}%` }" />
            </div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ progressLabel }}</p>
        </div>

    </div>
</template>
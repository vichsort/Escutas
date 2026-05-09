<script setup>
import { computed } from 'vue'
import { formatAlbumDuration, getReleaseYear } from '@/utils/formatters'

const props = defineProps({
    album: {
        type: Object,
        required: true
    },
    tracks: {
        type: Array,
        default: () => []
    }
})

const formattedDuration = computed(() => formatAlbumDuration(props.tracks))
const releaseYear = computed(() => getReleaseYear(props.album?.release_date))
</script>

<template>
    <div class="flex flex-col gap-4 pb-8 border-b border-gray-200 dark:border-gray-800/50">
        <span class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Álbum
        </span>

        <h1
            class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            {{ album?.name }}
        </h1>

        <div class="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 flex-wrap mt-2">

            <img v-if="album?.cover_url" :src="album.cover_url" class="w-6 h-6 rounded-full object-cover shadow-sm mr-1"
                alt="Artist" />

            <span class="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer transition-colors">
                {{ album?.artist }}
            </span>

            <span class="text-gray-400 dark:text-gray-600 mx-1">•</span>

            <span>{{ releaseYear }}</span>

            <span class="text-gray-400 dark:text-gray-600 mx-1">•</span>

            <span>{{ album?.total_tracks || tracks.length }} músicas,</span>
            <span class="text-gray-500 dark:text-gray-400 font-normal ml-0.5">{{ formattedDuration }}</span>

        </div>
    </div>
</template>
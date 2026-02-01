<script setup>
import { PenTool } from 'lucide-vue-next'

defineProps({
    track: {
        type: Object,
        required: true
    }
})

defineEmits(['rate'])
</script>

<template>
    <div
        class="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-4">

        <div class="relative w-20 h-20 flex-shrink-0">
            <img :src="track.album.cover_url" :alt="track.track_name"
                class="w-full h-full rounded-xl shadow-lg object-cover" />
        </div>

        <div class="text-center md:text-left">
            <span class="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">
                Ouvindo agora
            </span>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {{ track.track_name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
                {{ track.album.artist }}
            </p>
        </div>

        <div class="md:ml-auto mt-2 md:mt-0">
            <button @click="$emit('rate')"
                class="bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 shadow-sm shadow-primary/20">
                <PenTool :size="16" />
                Avaliar Álbum
            </button>
        </div>

    </div>
</template>
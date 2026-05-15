<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'
import { formatAlbumDuration, getReleaseYear } from '@/utils/formatters'
import BaseToggle from '@/components/ui/BaseToggle.vue'

const props = defineProps({
    album: {
        type: Object,
        required: true
    },
    tracks: {
        type: Array,
        default: () => []
    },
    isLegacyMode: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:isLegacyMode'])

const router = useRouter()

const formattedDuration = computed(() => formatAlbumDuration(props.tracks))
const releaseYear = computed(() => getReleaseYear(props.album?.release_date))

const modeOptions = [
    { label: 'Numérico', value: false },
    { label: 'Legado', value: true }
]
</script>

<template>
    <div class="flex flex-col gap-4 pb-8 border-b border-gray-200 dark:border-gray-800/50">

        <button
            @click="router.back()"
            class="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit -ml-1"
        >
            <ChevronLeft :size="18" />
            Voltar
        </button>

        <span class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Álbum
        </span>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                {{ album?.name }}
            </h1>

            <div class="md:pb-1 flex-shrink-0">
                <BaseToggle
                    variant="text"
                    :options="modeOptions"
                    :model-value="isLegacyMode"
                    @update:model-value="emit('update:isLegacyMode', $event)"
                />
            </div>
        </div>

        <div class="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 flex-wrap mt-2">
            <img
                v-if="album?.cover_url"
                :src="album.cover_url"
                class="w-6 h-6 rounded-full object-cover shadow-sm mr-1"
                alt="Artist"
            />

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
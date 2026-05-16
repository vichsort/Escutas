<script setup>
import { ref, computed } from 'vue'
import { Disc, Mic2, BookOpen, Music } from 'lucide-vue-next'

const props = defineProps({
    items: { type: Array, default: () => [] },
    command: { type: Function, required: true }
})

const selectedIndex = ref(0)

const TYPE_CONFIG = {
    ARTIST: { icon: Mic2, label: 'Artista' },
    ALBUM: { icon: Disc, label: 'Álbum' },
    TRACK: { icon: Music, label: 'Faixa' },
    REVIEW: { icon: BookOpen, label: 'Review' }
}

const selectItem = (item) => {
    props.command({
        id: item.id,
        label: item.name,
        targetType: item.type,
        targetId: item.id,
        spotifyAlbumId: item.spotify_album_id ?? null,
        spotifyArtistId: item.spotify_artist_id ?? null,
    })
}

const onKeyDown = ({ event }) => {
    if (event.key === 'ArrowUp') {
        selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length
        return true
    }
    if (event.key === 'ArrowDown') {
        selectedIndex.value = (selectedIndex.value + 1) % props.items.length
        return true
    }
    if (event.key === 'Enter') {
        if (props.items[selectedIndex.value]) {
            selectItem(props.items[selectedIndex.value])
        }
        return true
    }
    return false
}

defineExpose({ onKeyDown })
</script>

<template>
    <div class="w-72 rounded-xl bg-white dark:bg-surfaceDark border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">

        <div v-if="items.length === 0" class="px-4 py-3 text-sm text-gray-400 dark:text-gray-500">
            Nenhum resultado encontrado.
        </div>

        <ul v-else class="py-1 max-h-64 overflow-y-auto">
            <li
                v-for="(item, index) in items"
                :key="item.id"
                @click="selectItem(item)"
                @mouseenter="selectedIndex = index"
                class="flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors"
                :class="selectedIndex === index ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'"
            >
                <!-- Imagem -->
                <div class="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" />
                    <component v-else :is="TYPE_CONFIG[item.type]?.icon" :size="16" class="text-gray-400" />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 truncate">{{ item.subtitle || TYPE_CONFIG[item.type]?.label }}</p>
                </div>

                <!-- Type badge -->
                <span class="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {{ TYPE_CONFIG[item.type]?.label }}
                </span>
            </li>
        </ul>

    </div>
</template>
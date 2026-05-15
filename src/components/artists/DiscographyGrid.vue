<script setup>
import { Disc } from 'lucide-vue-next'
import SkeletonGrid from '@/components/ui/SkeletonGrid.vue'
import AlbumCard from '@/components/albums/AlbumCard.vue'

defineProps({
    albums: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    artistName: { type: String, default: '' }
})

const emit = defineEmits(['album-click'])

const handleClick = (album) => {
    if (album.is_completed) {
        console.log('[DiscographyGrid] Álbum já revisado:', album.album_id)
        return
    }
    emit('album-click', album)
}
</script>

<template>
    <section class="space-y-6">

        <h2 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Discografia
        </h2>

        <SkeletonGrid v-if="isLoading" :count="8" />

        <div v-else-if="albums.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <AlbumCard v-for="album in albums" :key="album.album_id" :album="{
                name: album.clean_name,
                artist: artistName,
                cover_url: album.cover_url,
                id: album.album_id
            }" :is-completed="album.is_completed"
                :class="album.is_completed ? 'opacity-60 cursor-default' : 'cursor-pointer'"
                @click="handleClick(album)" />
        </div>

        <div v-else class="py-12 text-center text-gray-400 dark:text-gray-600 text-sm">
            Nenhum álbum encontrado.
        </div>

    </section>
</template>
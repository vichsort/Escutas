<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy } from 'lucide-vue-next'
import PlatinumArtistCard from '@/components/me/PlatinumArtistCard.vue'

const props = defineProps({
    platinums: { type: Array, default: () => [] }
})

const router = useRouter()

const preview = computed(() => props.platinums.slice(0, 3))
</script>

<template>
    <section class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800/50">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Trophy :size="16" class="text-primary" />
                <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Platinas
                </h3>
                <span class="text-xs text-gray-400">({{ platinums.length }})</span>
            </div>
            <button v-if="platinums.length > 3" @click="router.push({ name: 'me-platinums' })"
                class="text-xs font-medium text-primary hover:underline transition-colors">
                Ver todas
            </button>
        </div>

        <div v-if="preview.length" class="grid grid-cols-3 gap-4">
            <PlatinumArtistCard v-for="artist in preview" :key="artist.spotify_artist_id" :artist="artist"
                @click="router.push({ name: 'artist', params: { id: artist.spotify_artist_id } })" />
        </div>

        <p v-else class="text-sm text-gray-400 italic">
            Nenhuma platina ainda.
        </p>
    </section>
</template>
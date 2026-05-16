<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Disc, Mic2, BookOpen, Music } from 'lucide-vue-next'
import { MENTION_ROUTES } from '@/constants/link_constants'

const props = defineProps({
    mention: { type: Object, required: true }
})

const router = useRouter()

const TYPE_CONFIG = {
    ARTIST: { icon: Mic2, label: 'Artista', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    ALBUM: { icon: Disc, label: 'Álbum', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    TRACK: { icon: Music, label: 'Faixa', color: 'bg-green-100 text-green-700 dark:bg-greeen-900/30 dark:text-green-300' },
    REVIEW: { icon: BookOpen, label: 'Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' }
}

const config = computed(() => TYPE_CONFIG[props.mention.target_type] ?? TYPE_CONFIG.REVIEW)

const handleClick = () => {
    const resolver = MENTION_ROUTES[props.mention.target_type]
    if (!resolver) return
    const route = resolver(props.mention)
    if (route) router.push(route)
}
</script>

<template>
    <span @click="handleClick"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-sm font-medium cursor-pointer transition-opacity hover:opacity-80"
        :class="config.color" :title="`${config.label}: ${mention.target_name}`">
        <component :is="config.icon" :size="12" aria-hidden="true" />
        {{ mention.target_name }}
    </span>
</template>
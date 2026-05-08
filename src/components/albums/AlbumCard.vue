<script setup>
import { Disc } from 'lucide-vue-next'
import BaseEntityCard from '@/components/ui/BaseEntityCard.vue'

defineProps({
    album: {
        type: Object,
        required: true
    }
})

defineEmits(['click'])
</script>

<template>
    <BaseEntityCard :title="album.name" :subtitle="album.artist" :image-url="album.cover_url" :is-round="false"
        @click="$emit('click', album)">
        <template #fallback>
            <Disc class="text-gray-400 dark:text-gray-600" :size="32" />
        </template>
    </BaseEntityCard>
</template>
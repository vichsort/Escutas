<script setup>
import { Mic2 } from 'lucide-vue-next'
import BaseEntityCard from '@/components/ui/BaseEntityCard.vue'

defineProps({
    artist: {
        type: Object,
        required: true
    }
})

defineEmits(['click'])
</script>

<template>
    <BaseEntityCard :title="artist.name" :image-url="artist.image_url" :is-round="true" @click="$emit('click', artist)">
        <template #fallback>
            <Mic2 class="text-gray-400 dark:text-gray-600" :size="32" />
        </template>
    </BaseEntityCard>
</template>
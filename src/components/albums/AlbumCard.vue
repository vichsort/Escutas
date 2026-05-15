<script setup>
import { Disc, Check } from 'lucide-vue-next'
import BaseEntityCard from '@/components/ui/BaseEntityCard.vue'

defineProps({
    album: { type: Object, required: true },
    isCompleted: { type: Boolean, default: null }
})

defineEmits(['click'])
</script>

<template>
    <BaseEntityCard :title="album.name" :subtitle="album.artist" :image-url="album.cover_url" :is-round="false"
        @click="$emit('click', album)">
        <template #fallback>
            <Disc class="text-gray-400 dark:text-gray-600" :size="32" />
        </template>

        <template v-if="isCompleted" #overlay>
            <div
                class="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                <Check :size="14" class="text-black" stroke-width="3" />
            </div>
        </template>
    </BaseEntityCard>
</template>
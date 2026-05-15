<script setup>
import { Mic2, Check } from 'lucide-vue-next'
import BaseEntityCard from '@/components/ui/BaseEntityCard.vue'

defineProps({
    artist: { type: Object, required: true },
    isPlatinum: { type: Boolean, default: null }
})

defineEmits(['click'])
</script>

<template>
    <BaseEntityCard :title="artist.name" :image-url="artist.image_url" :is-round="true" @click="$emit('click', artist)">
        <template #fallback>
            <Mic2 class="text-gray-400 dark:text-gray-600" :size="32" />
        </template>

        <template v-if="isPlatinum" #overlay>
            <div
                class="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                <Check :size="14" class="text-black" stroke-width="3" />
            </div>
        </template>
    </BaseEntityCard>
</template>
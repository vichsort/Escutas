<script setup>
import { computed } from 'vue'
import { Mic2, Trophy } from 'lucide-vue-next'

const props = defineProps({
    artist: { type: Object, required: true }
})

defineEmits(['click'])

const RADIUS = 44
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const dashOffset = computed(() =>
    CIRCUMFERENCE - (props.artist.percentage / 100) * CIRCUMFERENCE
)
</script>

<template>
    <div class="flex flex-col items-center gap-2 cursor-pointer group" @click="$emit('click', artist)">
        <!-- Imagem + anel de progresso -->
        <div class="relative w-16 h-16">
            <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <!-- Trilha -->
                <circle cx="50" cy="50" :r="RADIUS" fill="none" class="stroke-gray-200 dark:stroke-gray-800"
                    stroke-width="5" />
                <!-- Progresso -->
                <circle cx="50" cy="50" :r="RADIUS" fill="none" class="stroke-primary transition-all duration-700"
                    stroke-width="5" stroke-linecap="round" :stroke-dasharray="CIRCUMFERENCE"
                    :stroke-dashoffset="dashOffset" />
            </svg>

            <!-- Avatar -->
            <div class="absolute inset-[6px] rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                <img v-if="artist.image_url" :src="artist.image_url" :alt="artist.name"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div v-else class="w-full h-full flex items-center justify-center">
                    <Mic2 :size="20" class="text-gray-400 dark:text-gray-600" />
                </div>
            </div>

            <!-- Troféu se platina -->
            <div v-if="artist.is_platinum"
                class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md">
                <Trophy :size="10" class="text-black" />
            </div>
        </div>

        <!-- Nome -->
        <p class="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full max-w-[72px]">
            {{ artist.name }}
        </p>
    </div>
</template>
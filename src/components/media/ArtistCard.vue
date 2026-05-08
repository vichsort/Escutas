<script setup>
import { computed } from 'vue'
import { Mic2 } from 'lucide-vue-next'

const props = defineProps({
    artist: {
        type: Object,
        required: true
    }
})

defineEmits(['click'])

const imageUrl = computed(() => {
    if (props.artist.images && props.artist.images.length > 0) {
        return props.artist.images[0].url
    }
    return null
})

const primaryGenre = computed(() => {
    if (props.artist.genres && props.artist.genres.length > 0) {
        return props.artist.genres[0]
    }
    return 'Artista'
})
</script>

<template>
    <div 
        @click="$emit('click', artist)"
        class="group p-4 bg-white/5 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:bg-white/10 cursor-pointer border border-transparent hover:border-gray-700/50"
    >
        <div class="relative w-28 h-28 mb-4">
            <img 
                v-if="imageUrl" 
                :src="imageUrl" 
                :alt="`Foto de ${artist.name}`" 
                class="w-full h-full object-cover rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300"
            />
            
            <div 
                v-else 
                class="w-full h-full bg-gray-800 rounded-full flex items-center justify-center shadow-lg"
            >
                <Mic2 class="text-gray-500" :size="32" />
            </div>
        </div>

        <h3 class="font-bold text-sm text-gray-900 dark:text-white truncate w-full">
            {{ artist.name }}
        </h3>
        
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize truncate w-full">
            {{ primaryGenre }}
        </p>
    </div>
</template>
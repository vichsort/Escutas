<script setup>
import { ref, computed } from 'vue'
import { Disc } from 'lucide-vue-next'

const props = defineProps({
    day: { type: Number, required: true },
    reviews: { type: Array, default: () => [] }
})

const currentIndex = ref(0)

const sorted = computed(() =>
    [...props.reviews].sort((a, b) => b.average_score - a.average_score)
)

const current = computed(() => sorted.value[currentIndex.value] ?? null)

const hasMultiple = computed(() => sorted.value.length > 1)

const handleClick = () => {
    if (!hasMultiple.value) return
    currentIndex.value = (currentIndex.value + 1) % sorted.value.length
}
</script>

<template>
    <div class="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-surfaceDark select-none"
        :class="current ? 'cursor-pointer' : 'opacity-40'" @click="handleClick">
        <!-- Dia -->
        <div class="px-2 pt-1.5 pb-1 flex items-center justify-between">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ day }}</span>
            <span v-if="hasMultiple" class="text-[10px] text-gray-400 dark:text-gray-600">
                {{ currentIndex + 1 }}/{{ sorted.length }}
            </span>
        </div>

        <!-- Capa -->
        <div class="aspect-square w-full bg-gray-100 dark:bg-gray-800">
            <img v-if="current?.cover_url" :src="current.cover_url" :alt="current.album_name"
                class="w-full h-full object-cover transition-opacity duration-200" />
            <div v-else class="w-full h-full flex items-center justify-center">
                <Disc :size="20" class="text-gray-300 dark:text-gray-700" />
            </div>
        </div>
    </div>
</template>
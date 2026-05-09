<script setup>
defineProps({
    count: {
        type: Number,
        default: 8
    }
})

const getRandomWidth = () => {
    const widths = ['w-1/2', 'w-2/3', 'w-3/4', 'w-4/5', 'w-full']
    return widths[Math.floor(Math.random() * widths.length)]
}
</script>

<template>
    <div class="space-y-1">
        <div v-for="i in count" :key="i" class="flex items-center gap-4 py-2 px-2 rounded">
            <div class="w-6 h-4 bg-gray-200 dark:bg-surfaceDark rounded animate-pulse"></div>

            <div class="flex-1 min-w-0 flex items-center">
                <div class="h-4 bg-gray-200 dark:bg-surfaceDark rounded animate-pulse" :class="getRandomWidth()"></div>
            </div>

            <div class="w-20 h-9 bg-gray-200 dark:bg-surfaceDark rounded animate-pulse"></div>
        </div>
    </div>
</template>
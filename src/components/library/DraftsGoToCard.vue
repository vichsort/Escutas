<script setup>
import { useRouter } from 'vue-router'
import { PenLine } from 'lucide-vue-next'

defineProps({
    count: {
        type: Number,
        required: true
    }
})

const router = useRouter()

const navigateToDrafts = () => {
    router.push({ name: 'drafts' })
}
</script>

<template>
    <div @click="navigateToDrafts" class="group cursor-pointer flex flex-col transition-all duration-300">
        <div class="w-full aspect-square mb-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden
                    bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/20 dark:to-transparent 
                    border-2 border-dashed border-primary/40 group-hover:border-primary/80 
                    shadow-sm group-hover:shadow-md transition-all duration-300">

            <div class="text-primary group-hover:scale-110 transition-transform duration-500">
                <PenLine :size="48" stroke-width="1.5" />
            </div>

            <div
                class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none">
            </div>
        </div>

        <div class="flex flex-col min-w-0">
            <h3 class="font-bold text-gray-900 dark:text-white truncate text-base mb-1">
                Rascunhos Abertos
            </h3>
            <p class="text-sm font-medium text-primary truncate">
                {{ count }} review{{ count !== 1 ? 's' : '' }} em progresso
            </p>
        </div>
    </div>
</template>

<style scoped>
@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
</style>
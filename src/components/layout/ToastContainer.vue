<script setup>
import { useToastStore } from '@/stores/toast_store'
import { CheckCircle, XCircle, X } from 'lucide-vue-next'

const toastStore = useToastStore()
</script>

<template>
    <Teleport to="body">
        <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <TransitionGroup name="toast">
                <div
                    v-for="toast in toastStore.toasts"
                    :key="toast.id"
                    class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg w-80 border text-sm"
                    :class="{
                        'bg-white dark:bg-surfaceDark border-red-200 dark:border-red-500/20 text-gray-900 dark:text-white': toast.type === 'error',
                        'bg-white dark:bg-surfaceDark border-green-200 dark:border-green-500/20 text-gray-900 dark:text-white': toast.type === 'success',
                    }"
                >
                    <XCircle v-if="toast.type === 'error'" class="shrink-0 mt-0.5 text-red-500" :size="16" />
                    <CheckCircle v-else class="shrink-0 mt-0.5 text-primary" :size="16" />

                    <span class="flex-1 leading-snug">{{ toast.message }}</span>

                    <button
                        @click="toastStore.remove(toast.id)"
                        class="shrink-0 mt-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X :size="14" />
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.25s ease;
}
.toast-enter-from {
    opacity: 0;
    transform: translateX(16px);
}
.toast-leave-to {
    opacity: 0;
    transform: translateX(16px);
}
.toast-move {
    transition: transform 0.25s ease;
}
</style>
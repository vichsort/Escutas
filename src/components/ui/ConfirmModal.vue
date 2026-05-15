<script setup>
import { Loader2 } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps({
    isOpen: { type: Boolean, required: true },
    isLoading: { type: Boolean, default: false },
    title: { type: String, default: 'Confirmar ação' },
    description: { type: String, default: 'Tem certeza que deseja continuar?' },
    confirmLabel: { type: String, default: 'Confirmar' },
    cancelLabel: { type: String, default: 'Cancelar' },
    variant: { type: String, default: 'primary' } // 'primary' | 'danger'
})

defineEmits(['close', 'confirm'])

const variantClasses = {
    primary: 'bg-primary text-black shadow-primary/20 hover:brightness-110',
    danger: 'bg-red-500 text-white shadow-red-500/20 hover:brightness-110'
}
</script>

<template>
    <BaseModal :is-open="isOpen" :title="title" @close="$emit('close')">

        <p class="text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>

        <template #footer>
            <button @click="$emit('close')" :disabled="isLoading"
                class="px-6 py-3 rounded-full font-bold text-sm transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-surfaceDark disabled:opacity-50">
                {{ cancelLabel }}
            </button>

            <button @click="$emit('confirm')" :disabled="isLoading"
                class="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all disabled:opacity-50 disabled:hover:brightness-100 shadow-lg"
                :class="variantClasses[variant]">
                <Loader2 v-if="isLoading" class="animate-spin" :size="18" />
                {{ isLoading ? `${confirmLabel}...` : confirmLabel }}
            </button>
        </template>

    </BaseModal>
</template>
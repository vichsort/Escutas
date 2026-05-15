<script setup>
import { Trash2, Loader2 } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps({
    isOpen: { type: Boolean, required: true },
    isDeleting: { type: Boolean, default: false },
    title: { type: String, default: 'Deletar item' },
    description: { type: String, default: 'Esta ação é irreversível. Tem certeza?' }
})

defineEmits(['close', 'confirm'])
</script>

<template>
    <BaseModal :is-open="isOpen" :title="title" @close="$emit('close')">

        <p class="text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>

        <template #footer>
            <button @click="$emit('close')" :disabled="isDeleting"
                class="px-6 py-3 rounded-full font-bold text-sm transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-surfaceDark disabled:opacity-50">
                Cancelar
            </button>

            <button @click="$emit('confirm')" :disabled="isDeleting"
                class="flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-full font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:brightness-100 shadow-lg shadow-red-500/20">
                <Loader2 v-if="isDeleting" class="animate-spin" :size="18" />
                <Trash2 v-else :size="18" />
                {{ isDeleting ? 'Deletando...' : 'Deletar' }}
            </button>
        </template>

    </BaseModal>
</template>
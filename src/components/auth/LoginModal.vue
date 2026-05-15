<script setup>
import { Headphones } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
    isOpen: { type: Boolean, required: true }
})

defineEmits(['close', 'confirm'])
</script>

<template>
    <BaseModal :is-open="isOpen" :show-close-button="true" @close="$emit('close')">

        <div class="flex flex-col items-center text-center space-y-6 py-2">

            <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Headphones :size="40" class="text-primary" />
            </div>

            <div class="space-y-2">
                <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Escutas
                </h2>
                <p class="text-gray-500 dark:text-gray-400 text-lg">
                    Mais que escutar. <br />
                    <span class="text-primary font-bold">Sinta, avalie e compartilhe.</span>
                </p>
            </div>

            <p class="text-sm text-gray-400 px-4">
                Junte-se à nossa comunidade e transforme sua biblioteca musical em um diário de emoções.
            </p>

            <div class="w-full space-y-3 pt-2">
                <BaseButton variant="primary" block
                    class="h-12 text-base shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
                    @click="$emit('confirm')">
                    Conectar com Spotify
                </BaseButton>

                <button @click="$emit('close')"
                    class="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                    Agora não, apenas visitar
                </button>
            </div>

        </div>

    </BaseModal>
</template>
<script setup>
import { Headphones, X } from 'lucide-vue-next'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen"
            class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">

            <div
                class="bg-white dark:bg-[#121212] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-[#282828] animate-in zoom-in-95 duration-300 relative">

                <button @click="$emit('close')"
                    class="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <X :size="20" />
                </button>

                <div class="p-8 flex flex-col items-center text-center space-y-6">

                    <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
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

                    <div class="text-sm text-gray-400 px-4">
                        Junte-se à nossa comunidade e transforme sua biblioteca musical em um diário de emoções.
                    </div>

                    <div class="w-full space-y-3 pt-4">
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
            </div>
        </div>
    </Teleport>
</template>
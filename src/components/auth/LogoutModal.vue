<script setup>
import { LogOut, X } from 'lucide-vue-next'

defineProps({
    isOpen: Boolean
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen"
            class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">

            <div
                class="bg-white dark:bg-[#121212] w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-[#282828] animate-in zoom-in-95 duration-200">

                <div class="p-6 text-center space-y-4">

                    <div
                        class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <LogOut class="text-red-600 dark:text-red-500" :size="24" />
                    </div>

                    <div class="space-y-2">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                            Já vai embora?
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente no Spotify.
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-2">
                        <button @click="$emit('close')" class="px-4 py-2.5 rounded-xl font-bold text-sm transition-colors
                           bg-gray-100 text-gray-700 hover:bg-gray-200
                           dark:bg-[#282828] dark:text-gray-300 dark:hover:bg-[#333]">
                            Cancelar
                        </button>

                        <button @click="$emit('confirm')" class="px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-all
                           bg-red-500 hover:bg-red-600 hover:scale-105 shadow-lg shadow-red-500/20">
                            Sair
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </Teleport>
</template>
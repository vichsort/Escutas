<script setup>
import { X, Maximize2 } from 'lucide-vue-next'

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    showCloseButton: {
        type: Boolean,
        default: true
    },
    showExpandButton: {
        type: Boolean,
        default: false
    }
})

defineEmits(['close', 'expand'])
</script>

<template>
    <Teleport to="body">
        <div v-if="isOpen" @click.self="$emit('close')"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">

            <div
                class="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200
                        bg-surfaceLight dark:bg-surfaceDark text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800">

                <div
                    class="flex flex-col gap-4 p-6 border-b border-gray-100 dark:border-gray-800 bg-backgroundLight dark:bg-backgroundDark/50">
                    <slot name="header">
                        <div class="flex items-center justify-between"
                            v-if="title || showCloseButton || showExpandButton">
                            <h2 class="text-xl font-bold">{{ title }}</h2>

                            <div class="flex items-center gap-1">
                                <button v-if="showExpandButton" @click="$emit('expand')" title="Expandir"
                                    class="p-2 rounded-full transition-colors text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white">
                                    <Maximize2 :size="20" />
                                </button>

                                <button v-if="showCloseButton" @click="$emit('close')" title="Fechar"
                                    class="p-2 rounded-full transition-colors text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white">
                                    <X :size="24" />
                                </button>
                            </div>
                        </div>
                    </slot>
                </div>

                <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <slot></slot>
                </div>

                <div v-if="$slots.footer"
                    class="p-4 border-t border-gray-100 dark:border-gray-800 bg-backgroundLight dark:bg-backgroundDark/50 flex justify-end items-center gap-4">
                    <slot name="footer"></slot>
                </div>

            </div>
        </div>
    </Teleport>
</template>
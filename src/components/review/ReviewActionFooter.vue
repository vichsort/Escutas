<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    currentAverage: {
        type: [String, Number],
        required: true
    },
    isSubmitting: {
        type: Boolean,
        default: false
    },
    isReady: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['update:modelValue', 'cancel', 'submit'])

// Facilita o binding do textarea sem quebrar o v-model do pai
const localText = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
</script>

<template>
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-8">

        <div class="flex flex-col gap-2">
            <label for="review-text" class="text-sm font-bold text-gray-900 dark:text-white">
                Sua Review (Opcional)
            </label>
            <textarea id="review-text" v-model="localText" rows="5"
                placeholder="O que você achou das texturas sonoras, da produção e da composição deste álbum?"
                class="w-full p-4 text-base rounded-xl outline-none resize-y transition-all border shadow-sm
                       bg-surfaceLight border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400
                       dark:bg-surfaceDark dark:border-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-primary"></textarea>
        </div>

        <div
            class="flex flex-col sm:flex-row justify-between items-center gap-6 bg-backgroundLight dark:bg-backgroundDark/80 p-4 rounded-xl border border-gray-200 dark:border-gray-800">

            <div class="flex items-baseline gap-3">
                <span class="text-sm uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Sua
                    Média</span>
                <span class="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{{ currentAverage
                    }}</span>
            </div>

            <div class="flex items-center gap-4 w-full sm:w-auto">
                <button @click="$emit('cancel')"
                    class="flex-1 sm:flex-none px-6 py-3 rounded-full font-bold text-sm transition-all text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-surfaceDark">
                    Cancelar
                </button>

                <button @click="$emit('submit')" :disabled="isSubmitting || !isReady"
                    class="flex-1 sm:flex-none bg-primary text-black px-8 py-3 rounded-full font-bold text-sm hover:scale-105 hover:brightness-110 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Loader2 v-if="isSubmitting" class="animate-spin mr-2" :size="18" />
                    {{ isSubmitting ? 'Publicando...' : 'Publicar Review' }}
                </button>
            </div>
        </div>

    </div>
</template>
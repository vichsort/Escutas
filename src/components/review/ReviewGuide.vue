<script setup>
defineProps({
    modelValue: { type: String, default: '' },
    isOwner: { type: Boolean, default: false },
    isSaving: { type: Boolean, default: false },
    reviewText: { type: String, default: '' }
})

defineEmits(['update:modelValue', 'save', 'blog-post'])
</script>

<template>
    <section class="max-w-3xl space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800/50">

        <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Considerações & Guia
            </h3>
            <button v-if="isOwner" @click="$emit('blog-post')"
                class="text-xs font-medium text-primary hover:underline transition-colors">
                + Criar post no blog
            </button>
        </div>

        <textarea v-if="isOwner" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" rows="6"
            placeholder="Escreva sua análise, curiosidades ou guia sobre este álbum..."
            class="w-full p-4 rounded-xl outline-none resize-none transition-all border
                   bg-backgroundLight border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400
                   dark:bg-backgroundDark dark:border-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-primary" />

        <p v-else-if="reviewText" class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {{ reviewText }}
        </p>

        <p v-else class="text-sm text-gray-400 italic">
            Sem considerações adicionais.
        </p>

        <div v-if="isOwner" class="flex justify-end">
            <button @click="$emit('save')" :disabled="isSaving"
                class="bg-primary text-black px-8 py-3 rounded-full font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20">
                {{ isSaving ? 'Salvando...' : 'Salvar' }}
            </button>
        </div>

    </section>
</template>
<script setup>
const props = defineProps({
    tags: {
        type: Array,
        required: true,
        // Ex: [{ id: 'albums', label: 'Álbuns' }, { id: 'artists', label: 'Artistas' }]
        default: () => []
    },

    modelValue: {
        type: Array,
        default: () => []
    },

    defaultTag: {
        type: String,
    }
})

const emit = defineEmits(['update:modelValue'])

const toggleTag = (tagId) => {
    let newValue = [...props.modelValue]
    const index = newValue.indexOf(tagId)

    if (index === -1) {
        // Se não estava selecionado, adiciona
        newValue.push(tagId)
    } else {
        // Se já estava selecionado, remove
        newValue.splice(index, 1)
    }

    // Se o array ficou vazio, volta para o padrão
    if (newValue.length === 0) {
        newValue = [props.defaultTag]
    }

    emit('update:modelValue', newValue)
}
</script>

<template>
    <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar-hide py-2 w-full">
        <button v-for="tag in tags" :key="tag.id" @click="toggleTag(tag.id)"
            class="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border border-transparent"
            :class="modelValue.includes(tag.id)
                ? 'bg-primary text-black hover:opacity-80 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'">
            {{ tag.label }}
        </button>
    </div>
</template>

<style scoped>
.custom-scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.custom-scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
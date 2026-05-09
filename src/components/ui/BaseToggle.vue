<script setup>
const props = defineProps({
    // O valor atual (pode ser booleano para switch/icon, ou string/number/boolean para o text)
    modelValue: {
        type: [Boolean, String, Number],
        required: true
    },
    variant: {
        type: String,
        default: 'switch',
        validator: (value) => ['switch', 'icon', 'text'].includes(value)
    },
    // Usado apenas na variante 'text' (Ex: [{ label: 'Numérico', value: false }, { label: 'Legado', value: true }])
    options: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

// Função para variantes booleanas (switch e icon)
const toggleBoolean = () => {
    emit('update:modelValue', !props.modelValue)
}

// Função para variante de múltiplas opções (text)
const selectOption = (value) => {
    emit('update:modelValue', value)
}
</script>

<template>
    <button 
        v-if="variant === 'switch'"
        @click="toggleBoolean"
        type="button"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-backgroundDark"
        :class="modelValue ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'"
        role="switch"
        :aria-checked="modelValue"
    >
        <span 
            aria-hidden="true"
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
        ></span>
    </button>

    <button 
        v-else-if="variant === 'icon'"
        @click="toggleBoolean"
        type="button"
        class="p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-surfaceDark active:scale-95"
    >
        <slot name="on" v-if="modelValue"></slot>
        <slot name="off" v-else></slot>
    </button>

    <div 
        v-else-if="variant === 'text' && options.length > 0"
        class="flex p-1 rounded-lg w-full bg-gray-200 dark:bg-backgroundDark border border-transparent dark:border-gray-800"
    >
        <button 
            v-for="opt in options" 
            :key="opt.label"
            @click="selectOption(opt.value)"
            type="button"
            class="flex-1 py-1.5 px-3 text-sm font-bold rounded-md transition-all duration-200 select-none"
            :class="modelValue === opt.value
                ? 'bg-surfaceLight text-gray-900 shadow-sm dark:bg-surfaceDark dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        >
            {{ opt.label }}
        </button>
    </div>
</template>
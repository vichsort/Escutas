<script setup>
import BaseToggle from '@/components/ui/BaseToggle.vue'

defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})

defineEmits(['update:modelValue'])

const modeOptions = [
    { label: 'Numérico', value: false },
    { label: 'Legado', value: true }
]
</script>

<template>
    <div class="w-full max-w-sm mx-auto">
        <BaseToggle 
            variant="text" 
            :options="modeOptions"
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
        />
    </div>
</template>
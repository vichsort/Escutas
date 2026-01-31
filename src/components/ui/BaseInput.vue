<script setup>
defineProps(['modelValue', 'label', 'type', 'placeholder'])
defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <label v-if="label" class="text-sm font-medium ml-2 text-gray-700 dark:text-gray-300">
            {{ label }}
        </label>

        <input :type="type || 'text'" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder" class="w-full px-5 py-3 rounded-2xl 
             bg-gray-50 border border-transparent 
             text-gray-900 placeholder-gray-400
             focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 
             outline-none transition-all 
             
             dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
             dark:focus:bg-gray-900 dark:focus:border-primary" />
    </div>
</template>
<script setup>
import { LayoutGrid, List } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: String,
    default: 'grid',
    validator: (v) => ['grid', 'list'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-white/5">
    <button
      v-for="({ mode, Icon }) in [{ mode: 'grid', Icon: LayoutGrid }, { mode: 'list', Icon: List }]"
      :key="mode"
      @click="emit('update:modelValue', mode)"
      :class="[
        'p-1.5 rounded-md transition-all duration-200',
        modelValue === mode
          ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
      ]"
      :title="mode === 'grid' ? 'Grade' : 'Lista'"
    >
      <component :is="Icon" :size="18" />
    </button>
  </div>
</template>
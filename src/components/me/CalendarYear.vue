<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import CalendarMonth from '@/components/me/CalendarMonth.vue'

const props = defineProps({
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    calendar: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:month', 'update:year'])

const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const label = computed(() => `${MONTH_NAMES[props.month - 1]} ${props.year}`)

const prev = () => {
    if (props.month === 1) {
        emit('update:month', 12)
        emit('update:year', props.year - 1)
    } else {
        emit('update:month', props.month - 1)
    }
}

const next = () => {
    if (props.month === 12) {
        emit('update:month', 1)
        emit('update:year', props.year + 1)
    } else {
        emit('update:month', props.month + 1)
    }
}
</script>

<template>
    <div class="space-y-6">
        <!-- Navegação -->
        <div class="flex items-center justify-between">
            <button @click="prev"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
                <ChevronLeft :size="18" />
            </button>

            <span class="text-sm font-bold text-gray-900 dark:text-white tracking-wide">
                {{ label }}
            </span>

            <button @click="next"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
                <ChevronRight :size="18" />
            </button>
        </div>

        <!-- Grid do mês -->
        <CalendarMonth :month="month" :year="year" :calendar="calendar" />
    </div>
</template>
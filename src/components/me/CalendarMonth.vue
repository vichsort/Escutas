<script setup>
import { computed } from 'vue'
import CalendarDay from '@/components/me/CalendarDay.vue'

const props = defineProps({
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    calendar: { type: Object, default: () => ({}) } // { "3": [...], "17": [...] }
})

const daysInMonth = computed(() => new Date(props.year, props.month, 0).getDate())
const firstDayOfWeek = computed(() => new Date(props.year, props.month - 1, 1).getDay()) // 0 = domingo

const days = computed(() => {
    const result = []
    // células vazias pro offset
    for (let i = 0; i < firstDayOfWeek.value; i++) {
        result.push({ day: null, reviews: [] })
    }
    for (let d = 1; d <= daysInMonth.value; d++) {
        result.push({ day: d, reviews: props.calendar[String(d)] || [] })
    }
    return result
})

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
</script>

<template>
    <div class="space-y-3">
        <!-- Cabeçalho dos dias da semana -->
        <div class="grid grid-cols-7 gap-1">
            <div v-for="label in WEEK_DAYS" :key="label"
                class="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 py-1">
                {{ label }}
            </div>
        </div>

        <!-- Grid dos dias -->
        <div class="grid grid-cols-7 gap-1">
            <template v-for="(cell, i) in days" :key="i">
                <!-- Célula vazia (offset) -->
                <div v-if="cell.day === null" />

                <!-- Dia com ou sem review -->
                <CalendarDay v-else :day="cell.day" :reviews="cell.reviews" />
            </template>
        </div>
    </div>
</template>
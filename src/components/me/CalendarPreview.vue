<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar } from 'lucide-vue-next'
import CalendarDay from '@/components/me/CalendarDay.vue'

const props = defineProps({
    calendar: { type: Object, default: () => ({}) } // { "3": [...], "17": [...] }
})

const router = useRouter()

const lastDays = computed(() => {
    return Object.entries(props.calendar)
        .map(([day, reviews]) => ({ day: Number(day), reviews }))
        .filter(entry => entry.reviews.length > 0)
        .sort((a, b) => b.day - a.day)
        .slice(0, 3)
        .reverse()
})
</script>

<template>
    <section class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800/50">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Calendar :size="16" class="text-gray-400" />
                <h3 class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Seu Calendário
                </h3>
            </div>
            <button
                @click="router.push({ name: 'me-calendar' })"
                class="text-xs font-medium text-primary hover:underline transition-colors"
            >
                Ver tudo
            </button>
        </div>

        <div v-if="lastDays.length" class="grid grid-cols-3 gap-2">
            <CalendarDay
                v-for="entry in lastDays"
                :key="entry.day"
                :day="entry.day"
                :reviews="entry.reviews"
            />
        </div>

        <p v-else class="text-sm text-gray-400 italic">
            Nenhuma review este mês ainda.
        </p>
    </section>
</template>
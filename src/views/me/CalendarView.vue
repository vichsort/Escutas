<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users_store'
import { useAuthStore } from '@/stores/auth_store'
import CalendarYear from '@/components/me/CalendarYear.vue'
import { ChevronLeft } from 'lucide-vue-next'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

const now = new Date()
const month = ref(now.getMonth() + 1)
const year = ref(now.getFullYear())

const fetch = () => {
    userStore.fetchUserCalendar(authStore.user.id, month.value, year.value)
}

onMounted(fetch)
watch([month, year], fetch)
</script>

<template>
    <div class="max-w-2xl mx-auto px-4 py-10 space-y-6">

        <button
            @click="router.back()"
            class="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit -ml-1"
        >
            <ChevronLeft :size="18" />
            Voltar
        </button>

        <h1 class="text-xl font-bold text-gray-900 dark:text-white">Calendário</h1>

        <div v-if="userStore.isLoading.calendar" class="flex items-center justify-center py-20">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-organic-spin" />
        </div>

        <CalendarYear
            v-else
            :month="month"
            :year="year"
            :calendar="userStore.currentCalendar || {}"
            @update:month="month = $event"
            @update:year="year = $event"
        />

    </div>
</template>
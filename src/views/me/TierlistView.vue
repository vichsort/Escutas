<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users_store'
import { useAuthStore } from '@/stores/auth_store'
import TierlistExport from '@/components/me/TierlistExport.vue'
import { ChevronLeft, Download } from 'lucide-vue-next'
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const exportRef = ref(null)
const isExporting = ref(false)

const month = Number(route.query.month) || new Date().getMonth() + 1
const year = Number(route.query.year) || new Date().getFullYear()

const TIERS = ['S', 'A', 'B', 'C', 'D', 'E']

const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const label = computed(() => `${MONTH_NAMES[month - 1]} ${year}`)

const grouped = computed(() => {
    const calendar = userStore.currentCalendar || {}
    const all = Object.values(calendar).flat()
    return TIERS.reduce((acc, tier) => {
        acc[tier] = all.filter(r => r.tier === tier)
        return acc
    }, {})
})

onMounted(() => {
    userStore.fetchUserCalendar(authStore.user.id, month, year)
})

const handleExport = async () => {
    if (!exportRef.value) return
    isExporting.value = true
    try {
        const canvas = await html2canvas(exportRef.value, { backgroundColor: '#111111' })
        const link = document.createElement('a')
        link.download = `tierlist-${month}-${year}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    } finally {
        isExporting.value = false
    }
}
</script>

<template>
    <div class="max-w-2xl mx-auto px-4 py-10 space-y-6">

        <button @click="router.back()"
            class="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit -ml-1">
            <ChevronLeft :size="18" />
            Voltar
        </button>

        <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                Tierlist — {{ label }}
            </h1>
            <button @click="handleExport" :disabled="isExporting"
                class="flex items-center gap-2 text-sm font-medium text-primary hover:underline transition-colors disabled:opacity-50">
                <Download :size="16" />
                {{ isExporting ? 'Exportando...' : 'Exportar' }}
            </button>
        </div>

        <div v-if="userStore.isLoading.calendar" class="flex items-center justify-center py-20">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-organic-spin" />
        </div>

        <div ref="exportRef" v-else>
            <TierlistExport :grouped="grouped" />
        </div>

    </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/users_store'
import { useAuthStore } from '@/stores/auth_store'
import UserHeader from '@/components/me/UserHeader.vue'
import UserStats from '@/components/me/UserStats.vue'
import PlatinumPreview from '@/components/me/PlatinumPreview.vue'
import CalendarPreview from '@/components/me/CalendarPreview.vue'

const userStore = useUserStore()
const authStore = useAuthStore()

const now = new Date()
const month = now.getMonth() + 1
const year = now.getFullYear()

onMounted(() => {
    userStore.fetchFullDashboard(authStore.user.id, month, year)
})
</script>

<template>
    <div class="max-w-2xl mx-auto px-4 py-10 space-y-10">

        <div v-if="userStore.isLoading.profile" class="flex items-center justify-center py-20">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-organic-spin" />
        </div>

        <template v-else-if="userStore.currentProfile">

            <UserHeader
                :profile="userStore.currentProfile"
                :ranks="userStore.currentProfile.ranks"
            />

            <UserStats
                v-if="userStore.currentStats"
                :overview="userStore.currentStats.overview"
                :tier-distribution="userStore.currentStats.tier_distribution"
                :top-artists="userStore.currentStats.top_artists"
            />

            <PlatinumPreview :platinums="userStore.currentPlatinums" />

            <CalendarPreview :calendar="userStore.currentCalendar || {}" />

        </template>

    </div>
</template>
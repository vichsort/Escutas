<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
    Headphones,
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    LogIn
} from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth_store'
import { usePreferencesStore } from '@/stores/preferences_store'
import { SIDEBAR_LINKS } from '@/constants/link_constants'

import SidebarRecentReviews from '@/components/layout/SidebarRecentReviews.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import LogoutModal from '@/components/auth/LogoutModal.vue'

const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()
const isLoginModalOpen = ref(false)
const isLogoutModalOpen = ref(false)

const handleLoginConfirm = () => {
    isLoginModalOpen.value = false
    authStore.loginWithSpotify()
}

const handleLogoutConfirm = () => {
    isLogoutModalOpen.value = false
    authStore.logout()
}
</script>

<template>
    <aside
        class="flex-shrink-0 flex flex-col bg-surfaceLight dark:bg-black border-r border-gray-200 dark:border-gray-800 h-full transition-all duration-300 overflow-hidden"
        :class="preferencesStore.isSidebarOpen ? 'w-64' : 'w-20'">
        <div class="h-20 flex items-center transition-all duration-300"
            :class="preferencesStore.isSidebarOpen ? 'px-6 justify-between' : 'px-0 justify-center'">

            <div v-if="preferencesStore.isSidebarOpen" class="flex items-center gap-3 overflow-hidden">
                <div
                    class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 flex-shrink-0">
                    <Headphones :size="18" fill="currentColor" />
                </div>
                <h1 class="text-xl font-bold tracking-tighter text-gray-900 dark:text-white whitespace-nowrap">Escutas
                </h1>
            </div>

            <button @click="preferencesStore.toggleSidebar()"
                class="p-2 flex-shrink-0 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
                :title="preferencesStore.isSidebarOpen ? 'Recolher menu' : 'Expandir menu'">
                <PanelLeftClose v-if="preferencesStore.isSidebarOpen" :size="20" />
                <PanelLeftOpen v-else :size="20" />
            </button>
        </div>

        <nav class="px-3 space-y-1">
            <template v-for="link in SIDEBAR_LINKS" :key="link.name">
                <RouterLink v-if="!link.requiresAuth || authStore.user" :to="link.to"
                    active-class="bg-primary/10 text-primary font-bold dark:bg-primary/20"
                    class="flex items-center rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-white/10 group"
                    :class="preferencesStore.isSidebarOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'"
                    :title="!preferencesStore.isSidebarOpen ? link.name : ''">
                    <component :is="link.icon" :size="20" class="flex-shrink-0" />
                    <span v-if="preferencesStore.isSidebarOpen" class="whitespace-nowrap overflow-hidden text-ellipsis">
                        {{ link.name }}
                    </span>
                </RouterLink>
            </template>
        </nav>

        <SidebarRecentReviews :is-expanded="preferencesStore.isSidebarOpen" class="mt-4" />

        <div class="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-center"
            :class="preferencesStore.isSidebarOpen ? '' : 'px-2'">

            <template v-if="authStore.user">
                <div v-if="preferencesStore.isSidebarOpen"
                    class="flex items-center gap-3 bg-gray-100 dark:bg-white/5 p-2 rounded-xl transition-colors hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer group w-full">
                    <img :src="authStore.user.avatar_url || `https://ui-avatars.com/api/?name=${authStore.user.display_name}&background=1DB954&color=fff`"
                        class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 group-hover:border-primary transition-colors flex-shrink-0"
                        alt="Avatar" />
                    <div class="overflow-hidden flex-1">
                        <p class="text-xs font-bold truncate text-gray-900 dark:text-white">
                            {{ authStore.user.display_name }}
                        </p>
                        <button @click.stop="isLogoutModalOpen = true"
                            class="text-[10px] text-red-500 hover:text-red-400 font-medium uppercase tracking-wide hover:underline whitespace-nowrap">
                            Sair
                        </button>
                    </div>
                </div>

                <div v-else @click="isLogoutModalOpen = true" title="Sair da conta"
                    class="relative group cursor-pointer w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 transition-colors hover:border-red-500 flex-shrink-0">
                    <img :src="authStore.user.avatar_url || `https://ui-avatars.com/api/?name=${authStore.user.display_name}&background=1DB954&color=fff`"
                        class="w-full h-full object-cover transition-all duration-300 group-hover:opacity-30 group-hover:blur-[1px]"
                        alt="Avatar" />
                    <div
                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20">
                        <LogOut :size="16" class="text-red-500" />
                    </div>
                </div>
            </template>

            <template v-else>
                <div v-if="preferencesStore.isSidebarOpen" class="w-full">
                    <BaseButton block @click="isLoginModalOpen = true"
                        class="shadow-md shadow-primary/20 whitespace-nowrap">
                        Entrar
                    </BaseButton>
                </div>

                <button v-else @click="isLoginModalOpen = true" title="Entrar"
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary transition-colors border border-transparent hover:border-primary/30 flex-shrink-0 group">
                    <LogIn :size="20" class="group-hover:scale-110 transition-transform" />
                </button>
            </template>
        </div>

        <LoginModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" @confirm="handleLoginConfirm" />
        <LogoutModal :is-open="isLogoutModalOpen" @close="isLogoutModalOpen = false" @confirm="handleLogoutConfirm" />
    </aside>
</template>
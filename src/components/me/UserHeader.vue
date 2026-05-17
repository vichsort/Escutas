<script setup>
import { computed } from 'vue'
import StreakBadge from '@/components/ui/StreakBadge.vue'
import RankBadge from '@/components/ui/RankBadge.vue'

const props = defineProps({
    profile: { type: Object, required: true },
    ranks: { type: Object, default: () => ({}) }
})

const avatarFallback = computed(() =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(props.profile.display_name)}&background=1DB954&color=fff`
)

const rankList = computed(() => Object.values(props.ranks))

const joinedYear = computed(() => {
    if (!props.profile.joined_at) return null
    return new Date(props.profile.joined_at).getFullYear()
})
</script>

<template>
    <div class="flex flex-col gap-4 pb-8 border-b border-gray-200 dark:border-gray-800/50">

        <span class="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Meu Perfil
        </span>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">

            <!-- Esquerda: foto + nome + streak -->
            <div class="flex items-center gap-5">
                <img :src="profile.avatar_url || avatarFallback" :alt="profile.display_name"
                    class="w-16 h-16 rounded-full object-cover shadow-md flex-shrink-0" />
                <div class="flex flex-col gap-1.5">
                    <h1
                        class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                        {{ profile.display_name }}
                    </h1>
                    <div class="flex items-center gap-2">
                        <StreakBadge v-if="profile.current_streak > 0" :streak="profile.current_streak" />
                        <span v-if="joinedYear" class="text-xs text-gray-400 dark:text-gray-600">
                            desde {{ joinedYear }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Direita: badges -->
            <div v-if="rankList.length" class="flex flex-wrap gap-2 md:pb-1">
                <RankBadge v-for="label in rankList" :key="label" :label="label" />
            </div>

        </div>

    </div>
</template>
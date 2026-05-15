<script setup>
import { Music2 } from 'lucide-vue-next'

defineProps({
    review: { type: Object, required: true },
    userName: { type: String, default: '' }
})

const getScoreColor = (score) => {
    if (score >= 9.5) return 'text-yellow-400'
    if (score >= 8.0) return 'text-green-500'
    if (score >= 6.0) return 'text-blue-500'
    if (score >= 3.0) return 'text-orange-500'
    return 'text-red-500'
}
</script>

<template>
    <div class="bg-surfaceLight dark:bg-surfaceDark p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl relative flex flex-col h-auto w-full box-border overflow-x-auto">

        <div class="flex gap-10 relative z-10 flex-1 items-start min-w-[700px]">

            <div class="flex flex-col items-center gap-6 w-1/3 min-w-[220px] text-center shrink-0">
                <div class="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl bg-black">
                    <img
                        :src="review.cover_url"
                        class="w-full h-full object-cover"
                        crossorigin="anonymous"
                    />
                </div>

                <div class="w-full space-y-3">
                    <h2 class="text-3xl font-black text-gray-900 dark:text-white leading-normal pb-2 line-clamp-2"
                        :title="review.album_name">
                        {{ review.album_name }}
                    </h2>
                    <p class="text-xl text-gray-500 dark:text-gray-400 truncate pb-1">
                        {{ review.artist_name }}
                    </p>
                </div>

                <div class="flex items-center gap-4 px-6 py-3 bg-black/5 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 whitespace-nowrap mt-2">
                    <span class="text-sm uppercase font-bold tracking-widest text-gray-400">Score Final</span>
                    <span class="text-4xl font-black block leading-none pt-1"
                        :class="getScoreColor(review.average_score)">
                        {{ review.average_score }}
                    </span>
                </div>
            </div>

            <div class="flex-1 flex flex-col min-w-0 self-stretch">
                <div class="flex items-center gap-3 mb-6 shrink-0 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <Music2 :size="18" class="text-gray-400" />
                    <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Tracklist & Notas
                    </h3>
                </div>

                <div class="flex flex-col gap-0 w-full">
                    <div
                        v-for="track in review.tracks"
                        :key="track.id"
                        class="py-3 px-2 rounded-lg border-b border-dashed border-gray-200 dark:border-gray-800 last:border-0 w-full grid grid-cols-[32px_1fr_48px] gap-6 items-center"
                    >
                        <span class="text-sm font-mono text-gray-500 text-center shrink-0">
                            {{ track.track_number }}
                        </span>

                        <span class="text-lg font-medium text-gray-700 dark:text-gray-200 truncate min-w-0 block pb-1 leading-relaxed"
                            :title="track.track_name">
                            {{ track.track_name }}
                        </span>

                        <div class="text-lg font-bold font-mono text-right shrink-0"
                            :class="track.is_ignored ? 'text-gray-400' : getScoreColor(track.score)">
                            {{ track.is_ignored ? '—' : track.score }}
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center opacity-60 shrink-0">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-primary/20">
                    E
                </div>
                <span class="text-base font-bold tracking-tight">Escutas.app</span>
            </div>
            <span class="text-sm font-medium truncate max-w-[200px]">
                Review por {{ userName || review.user_name }}
            </span>
        </div>

    </div>
</template>
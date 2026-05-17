<script setup>
import { X, RotateCcw } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
    track: {
        type: Object,
        required: true
    },
    isLegacyMode: {
        type: Boolean,
        required: true
    },
    legacyOptions: {
        type: Array,
        required: true
    },
    readonly: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:score', 'toggle-ignore'])

const localScore = computed({
    get: () => props.track.userScore,
    set: (value) => {
        if (props.readonly) return
        emit('update:score', { trackId: props.track.id, score: value })
    }
})

const handleToggleIgnore = () => {
    if (props.readonly) return
    emit('toggle-ignore', props.track.id)
}
</script>

<template>
    <div class="flex items-center gap-4 py-2 px-2 rounded transition-colors" :class="[
        { 'opacity-60 bg-gray-50/50 dark:bg-white/5': track.isIgnored },
        readonly ? '' : 'group hover:bg-gray-50 dark:hover:bg-white/5'
    ]">

        <div class="w-8 relative flex items-center justify-center">

            <span class="text-sm font-mono text-gray-400" :class="{ 'opacity-0': track.isIgnored && !readonly }">
                {{ track.track_number }}
            </span>

            <button v-if="!readonly" @click="handleToggleIgnore"
                class="absolute inset-0 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                :class="{ 'opacity-100': track.isIgnored }"
                :title="track.isIgnored ? 'Restaurar faixa' : 'Ignorar faixa'">
                <RotateCcw v-if="track.isIgnored" :size="16" class="text-primary hover:text-primary/80" />
                <X v-else :size="18" class="text-red-500 hover:text-red-600" />
            </button>

        </div>

        <div class="flex-1 min-w-0">
            <p class="text-base font-medium truncate transition-all duration-300"
                :class="track.isIgnored ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'"
                :title="track.name">
                {{ track.name }}
            </p>
        </div>

        <div class="w-32 md:w-40 flex justify-end transition-opacity duration-300"
            :class="{ 'opacity-50 grayscale': track.isIgnored }">

            <template v-if="readonly">
                <span class="text-base font-bold text-gray-900 dark:text-white">
                    {{ track.isIgnored ? '—' : (track.userScore ?? '—') }}
                </span>
            </template>

            <template v-else>
                <select v-if="isLegacyMode" v-model.number="localScore" class="w-full text-sm rounded py-2 px-3 outline-none appearance-none cursor-pointer text-right font-medium transition-colors border
                           bg-surfaceLight border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary
                           dark:bg-surfaceDark dark:border-gray-800 dark:text-white dark:focus:border-primary"
                    style="text-align-last: right;">
                    <option v-for="opt in legacyOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>

                <input v-else type="number" v-model.number="localScore" min="0" max="10" step="0.5" class="w-20 text-right font-bold rounded py-2 px-3 outline-none transition-colors border
                           bg-surfaceLight border-gray-200 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary
                           dark:bg-surfaceDark dark:border-gray-800 dark:text-white dark:focus:border-primary" />
            </template>

        </div>

    </div>
</template>
<script setup>
import { computed } from 'vue'
import { Search, SlidersHorizontal, Check, X } from 'lucide-vue-next'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'
import { TIER_OPTIONS, SORT_OPTIONS } from '@/constants/filter_constants'

const props = defineProps({
    filters: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update'])

const updateFilter = (key, value) => {
    emit('update', { [key]: value })
}

// O select de ordenação usa o formato "campo-ordem" (ex: "created_at-desc")
const currentSort = computed({
    get: () => `${props.filters.sort_by}-${props.filters.sort_order}`,
    set: (combinedValue) => {
        const [sort_by, sort_order] = combinedValue.split('-')
        emit('update', { sort_by, sort_order })
    }
})

// Conta quantos filtros estão ativos para mostrar uma bolinha vermelha/verde no botão
const activeFilterCount = computed(() => {
    let count = 0
    if (props.filters.tier) count++
    if (props.filters.is_private) count++
    // if (props.filters.genre) count++ (a gente faz isso dps)
    return count
})

const clearFilters = (closeDropdown) => {
    emit('update', {
        tier: null,
        is_private: null,
        sort_by: 'created_at',
        sort_order: 'desc'
    })
    closeDropdown()
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-4 w-full items-start md:items-center justify-between">

        <div class="w-full md:flex-1 max-w-2xl">
            <BaseInput :model-value="filters.search" @update:model-value="updateFilter('search', $event)"
                placeholder="Buscar álbum ou artista..." class="w-full">
                <template #prefix>
                    <Search :size="18" class="text-gray-400" />
                </template>
            </BaseInput>
        </div>

        <BaseDropdown class="w-full md:w-auto">
            <template #trigger="{ isOpen }">
                <button
                    class="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border"
                    :class="isOpen || activeFilterCount > 0
                        ? 'bg-primary/10 border-primary text-primary dark:text-primary'
                        : 'bg-white dark:bg-surfaceDark border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'">
                    <SlidersHorizontal :size="18" />
                    Filtros

                    <span v-if="activeFilterCount > 0"
                        class="flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-black bg-primary rounded-full">
                        {{ activeFilterCount }}
                    </span>
                </button>
            </template>

            <template #default="{ close }">
                <div class="p-5 space-y-6 w-72">

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Ordenação</label>
                        <select v-model="currentSort"
                            class="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none appearance-none">
                            <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Avaliação (Tier)</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button v-for="tier in TIER_OPTIONS" :key="tier.value"
                                @click="updateFilter('tier', filters.tier === tier.value ? null : tier.value)"
                                class="px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors text-left"
                                :class="filters.tier === tier.value
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'">
                                {{ tier.label }}
                            </button>
                        </div>
                    </div>

                    <div class="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <label class="flex items-center gap-3 cursor-pointer group">
                            <div class="relative flex items-center justify-center w-5 h-5 rounded border border-gray-300 dark:border-gray-600 group-hover:border-primary transition-colors"
                                :class="{ 'bg-primary border-primary': filters.is_private }">
                                <Check v-if="filters.is_private" :size="14" class="text-black" />
                            </div>
                            <span class="text-sm text-gray-700 dark:text-gray-300 font-medium">Apenas Privadas</span>

                            <input type="checkbox" class="hidden" :checked="filters.is_private"
                                @change="updateFilter('is_private', $event.target.checked ? true : null)" />
                        </label>
                    </div>

                    <div v-if="activeFilterCount > 0" class="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button @click="clearFilters(close)"
                            class="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
                            <X :size="16" />
                            Limpar Filtros
                        </button>
                    </div>

                </div>
            </template>
        </BaseDropdown>

    </div>
</template>
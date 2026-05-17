import { ref } from 'vue'
import { defineStore } from 'pinia'

let nextId = 0

export const useToastStore = defineStore('toast', () => {
    const toasts = ref([])

    const add = (message, type = 'error', duration = 4000) => {
        const id = nextId++
        toasts.value.push({ id, message, type })
        setTimeout(() => remove(id), duration)
    }

    const remove = (id) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return { toasts, add, remove }
})
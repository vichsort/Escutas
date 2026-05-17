import { useToastStore } from '@/stores/toast_store'

export function useToast() {
    const toastStore = useToastStore()

    const toastError = (message = 'Algo deu errado.') => toastStore.add(message, 'error')
    const toastSuccess = (message) => toastStore.add(message, 'success')

    return { toastError, toastSuccess }
}
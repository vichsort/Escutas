<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth_store'
import { Loader2 } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const code = route.query.code

  if (code) {
    const success = await authStore.handleCallback(code)

    if (success) {
      router.replace({ path: '/', query: {} })
    } else {
      router.replace({ path: '/', query: { error: 'login_failed' } })
    }
  } else {
    router.replace({ path: '/' })
  }
})
</script>

<template>
    <div class="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-4">
        <Loader2 class="animate-spin text-primary" :size="48" />
        <h2 class="text-xl font-medium text-gray-600 dark:text-gray-300">Autenticando...</h2>
    </div>
</template>
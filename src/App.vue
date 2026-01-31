<script setup>
import { useThemeStore } from '@/stores/theme_store'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { Moon, Sun } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>

<template>
  <div class="min-h-screen bg-background-light dark:bg-background-dark p-8 transition-colors duration-300">

    <div class="max-w-md mx-auto space-y-8">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Escutas</h1>
        <button @click="themeStore.toggleTheme"
          class="p-3 rounded-full bg-white dark:bg-surface-dark shadow-sm hover:scale-110 transition-transform">
          <Moon v-if="!themeStore.isDark" class="text-gray-800" />
          <Sun v-else class="text-yellow-400" />
        </button>
      </div>

      <BaseCard>
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Login</h2>

        <div class="space-y-4">
          <BaseInput label="E-mail" placeholder="seu@email.com" />
          <BaseInput label="Senha" type="password" placeholder="••••••••" />

          <div class="pt-2">
            <BaseButton block>Entrar</BaseButton>
          </div>

          <BaseButton variant="secondary" block>Criar Conta</BaseButton>
        </div>
      </BaseCard>

      <div class="flex gap-2 justify-center">
        <BaseButton variant="ghost">Esqueci a senha</BaseButton>
      </div>
    </div>

  </div>
</template>
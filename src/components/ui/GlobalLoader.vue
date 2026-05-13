<script setup>
import { useLoadingStore } from '@/stores/loading_store'

const loadingStore = useLoadingStore()
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="loadingStore.isLoading" 
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-backgroundLight/80 dark:bg-backgroundDark/80 backdrop-blur-md transition-colors duration-300"
    >
      
      <div class="relative w-16 h-16 mb-6">
        <div class="absolute inset-0 rounded-full border-4 border-gray-300 dark:border-gray-700 opacity-30"></div>
        <div class="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-organic-spin"></div>
      </div>

      <div class="h-8 flex items-center justify-center overflow-hidden">
        <Transition name="slip-up" mode="out-in">
          <p 
            :key="loadingStore.message" 
            class="text-lg font-medium text-gray-800 dark:text-gray-200"
          >
            {{ loadingStore.message }}
          </p>
        </Transition>
      </div>

    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slip-up-enter-active,
.slip-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slip-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slip-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
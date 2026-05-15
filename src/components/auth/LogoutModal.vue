<script setup>
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

defineProps({
    isOpen: { type: Boolean, required: true }
})

defineEmits(['close', 'confirm'])
</script>

<template>
    <ConfirmModal :is-open="isOpen" title="Já vai embora?"
        description="Tem certeza que deseja sair da sua conta? Não se preocupe, não perderá nada, mas você precisará fazer login novamente no Spotify."
        confirm-label="Sair" variant="danger" @close="$emit('close')" @confirm="$emit('confirm')" />
</template>
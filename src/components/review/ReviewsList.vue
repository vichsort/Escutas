<script setup>
defineProps({ reviews: Array })
</script>

<template>
  <div class="space-y-4">
    <ReviewCard v-for="review in reviews" :key="review.id" :review="review" />
    <EmptyState v-if="reviews.length === 0">Nenhuma review encontrada.</EmptyState>
  </div>
</template>
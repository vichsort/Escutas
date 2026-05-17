<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogPost } from '@/composables/useBlogPost'
import BlogMentionChip from '@/components/blog/BlogMentionChip.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const { post, isLoading, isActing, error, isOwner, fetchPost, handleDelete, handleEdit } = useBlogPost()

const showDeleteModal = ref(false)

onMounted(() => fetchPost(route.params.slug))

const confirmDelete = async () => {
    await handleDelete()
    showDeleteModal.value = false
}
</script>

<template>
    <div class="max-w-2xl mx-auto px-4 py-10">

        <!-- Loading -->
        <div v-if="isLoading" class="space-y-4 animate-pulse">
            <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
            <div class="h-64 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="text-center py-20 text-gray-500 dark:text-gray-400">
            {{ error }}
        </div>

        <!-- Conteúdo -->
        <template v-else-if="post">

            <!-- Capa -->
            <div v-if="post.cover_image_url"
                class="rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800 mb-8">
                <img :src="post.cover_image_url" :alt="post.title" class="w-full h-full object-cover" />
            </div>

            <!-- Cabeçalho -->
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ post.title }}</h1>
                <p class="text-sm text-gray-400">
                    {{ post.author?.display_name }} · {{ new Date(post.created_at).toLocaleDateString('pt-BR') }}
                </p>
            </div>

            <!-- Toolbar owner -->
            <div v-if="isOwner" class="flex items-center gap-2 mb-6">
                <BaseButton variant="ghost" size="sm" @click="handleEdit">Editar</BaseButton>
                <BaseButton variant="ghost" size="sm" class="text-red-500 hover:text-red-600"
                    @click="showDeleteModal = true">
                    Excluir
                </BaseButton>
            </div>

            <!-- Corpo -->
            <div class="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
                v-html="post.content" />

            <!-- Menções -->
            <div v-if="post.mentions?.length" class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Menções</p>
                <div class="flex flex-wrap gap-2">
                    <BlogMentionChip v-for="mention in post.mentions" :key="mention.target_id" :mention="mention" />
                </div>
            </div>

        </template>

        <!-- Modal de confirmação -->
        <ConfirmModal :is-open="showDeleteModal" :is-loading="isActing" title="Excluir post"
            description="Essa ação não pode ser desfeita. Deseja continuar?" confirm-label="Excluir" variant="danger"
            @confirm="confirmDelete" @close="showDeleteModal = false" />

    </div>
</template>
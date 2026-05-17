<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/blog_store'
import { useBlogEditor } from '@/composables/useBlogEditor'
import PostEditor from '@/components/blog/PostEditor.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const blogStore = useBlogStore()

const postId = route.params.id || null
const { title, coverImageUrl, editorInstance, isSaving, isPublishing, error, save, scheduleAutosave, initWithPost, initWithMention } = useBlogEditor(postId)

const postEditorRef = ref(null)

const onEditorReady = () => {
    if (postEditorRef.value?.editor) {
        editorInstance.value = postEditorRef.value.editor.value
    }
}

onMounted(async () => {
    await Promise.resolve()
    onEditorReady()

    if (postId) {
        const post = blogStore.currentPost
        if (post && post.id === postId) {
            initWithPost(post)
            if (editorInstance.value) {
                editorInstance.value.commands.setContent(post.content, false)
            }
        }
    }

    const { mentionType, mentionId, mentionName } = route.query
    if (mentionType && mentionId && mentionName) {
        initWithMention(mentionType, mentionId, mentionName)
    }
})

const handleUpdate = () => {
    scheduleAutosave()
}
</script>

<template>
    <div class="max-w-2xl mx-auto px-4 py-10 space-y-6">

        <!-- Header -->
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ postId ? 'Editar post' : 'Novo post' }}
            </h1>
            <div class="flex items-center gap-2">
                <span v-if="error" class="text-sm text-red-500">{{ error }}</span>
                <BaseButton variant="ghost" :disabled="isSaving || isPublishing" @click="save(false)">
                    {{ isSaving ? 'Salvando...' : 'Salvar rascunho' }}
                </BaseButton>
                <BaseButton variant="primary" :disabled="isSaving || isPublishing" @click="save(true)">
                    {{ isPublishing ? 'Publicando...' : 'Publicar' }}
                </BaseButton>
            </div>
        </div>

        <!-- Campos -->
        <BaseInput v-model="title" placeholder="Título do post" />

        <BaseInput v-model="coverImageUrl" placeholder="URL da imagem de capa (opcional)" />

        <!-- Preview da capa -->
        <div v-if="coverImageUrl" class="rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
            <img :src="coverImageUrl" alt="Capa do post" class="w-full h-full object-cover"
                @error="coverImageUrl = ''" />
        </div>

        <!-- Editor -->
        <PostEditor ref="postEditorRef" :model-value="''" :on-update="handleUpdate" @vue:mounted="onEditorReady" />

    </div>
</template>
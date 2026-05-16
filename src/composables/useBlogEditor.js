import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog_store'
import { MENTION_ROUTES } from '@/constants/link_constants'

const AUTOSAVE_DELAY = 1500

export function useBlogEditor(postId = null) {
    const router = useRouter()
    const blogStore = useBlogStore()

    const title = ref('')
    const coverImageUrl = ref('')
    const editorInstance = ref(null)
    const isSaving = ref(false)
    const isPublishing = ref(false)
    const error = ref(null)
    const savedPostId = ref(postId)
    let autosaveTimer = null

    // Mapeamento target_type para rota
    const resolveMentionRoute = (targetType, attrs) => {
        const resolver = MENTION_ROUTES[targetType]
        return resolver ? resolver(attrs) : null
    }

    // Extrai mentions[] do JSON
    const extractMentions = (json) => {
        const mentions = []
        const walk = (node) => {
            if (node.type === 'mention' && node.attrs) {
                mentions.push({
                    target_type: node.attrs.targetType,
                    target_id: node.attrs.targetId,
                    target_name: node.attrs.label
                })
            }
            if (node.content) node.content.forEach(walk)
        }
        if (json?.content) json.content.forEach(walk)
        return mentions
    }

    const buildPayload = () => {
        if (!editorInstance.value) return null
        const json = editorInstance.value.getJSON()
        const html = editorInstance.value.getHTML()
        return {
            title: title.value,
            content: html,
            cover_image_url: coverImageUrl.value || null,
            mentions: extractMentions(json)
        }
    }

    const save = async (publish = false) => {
        const payload = buildPayload()
        if (!payload || !payload.title) return

        if (publish) payload.status = 'PUBLISHED'

        try {
            publish ? isPublishing.value = true : isSaving.value = true
            error.value = null

            let post
            if (savedPostId.value) {
                post = await blogStore.updatePost(savedPostId.value, payload)
            } else {
                post = await blogStore.createPost(payload)
                savedPostId.value = post.id
            }

            if (publish) {
                router.push({ name: 'blog-post', params: { slug: post.slug } })
            }

            return post
        } catch (e) {
            error.value = e.response?.data?.message || 'Erro ao salvar.'
        } finally {
            isSaving.value = false
            isPublishing.value = false
        }
    }

    const scheduleAutosave = () => {
        clearTimeout(autosaveTimer)
        autosaveTimer = setTimeout(() => {
            if (title.value) save(false)
        }, AUTOSAVE_DELAY)
    }

    const initWithPost = (post) => {
        title.value = post.title
        coverImageUrl.value = post.cover_image_url || ''
        savedPostId.value = post.id
    }

    const initWithMention = (targetType, targetId, targetName) => {
        // Pré-popula menção vinda do ReviewGuide
        if (!editorInstance.value) return
        editorInstance.value.commands.insertContent({
            type: 'mention',
            attrs: { targetType, targetId, label: targetName }
        })
    }

    return {
        title,
        coverImageUrl,
        editorInstance,
        isSaving,
        isPublishing,
        error,
        savedPostId,
        save,
        scheduleAutosave,
        initWithPost,
        initWithMention,
        resolveMentionRoute,
        extractMentions
    }
}
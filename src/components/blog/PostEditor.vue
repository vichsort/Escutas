<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import { Bold, Italic, Link as LinkIcon, AtSign } from 'lucide-vue-next'
import { useMentionSuggestion } from '@/composables/useMentionSuggestion'

const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Escreva seu post...' },
    onUpdate: { type: Function, default: null }
})

const mentionSuggestion = useMentionSuggestion()

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: props.placeholder
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-primary underline cursor-pointer'
            }
        }),
        Mention.configure({
            HTMLAttributes: { class: 'mention-chip' },
            suggestion: mentionSuggestion
        })
    ],
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
        props.onUpdate?.()
    }
})

const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()

const setLink = () => {
    const url = window.prompt('URL do link:')
    if (!url) return
    editor.value?.chain().focus().setLink({ href: url }).run()
}

const triggerMention = () => {
    editor.value?.chain().focus().insertContent('@').run()
}

watch(() => props.modelValue, (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
        editor.value.commands.setContent(val, false)
    }
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
    <div
        class="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-900 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">

        <!-- Toolbar -->
        <div
            class="flex items-center gap-1 px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-surfaceDark">
            <button @click="toggleBold"
                :class="editor?.isActive('bold') ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                class="p-1.5 rounded-md transition-colors" title="Negrito" type="button">
                <Bold :size="16" />
            </button>

            <button @click="toggleItalic"
                :class="editor?.isActive('italic') ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                class="p-1.5 rounded-md transition-colors" title="Itálico" type="button">
                <Italic :size="16" />
            </button>

            <div class="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

            <button @click="setLink"
                :class="editor?.isActive('link') ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
                class="p-1.5 rounded-md transition-colors" title="Link" type="button">
                <LinkIcon :size="16" />
            </button>

            <button @click="triggerMention"
                class="p-1.5 rounded-md transition-colors text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                title="Mencionar" type="button">
                <AtSign :size="16" />
            </button>
        </div>

        <!-- Área de escrita -->
        <EditorContent :editor="editor"
            class="prose prose-sm dark:prose-invert max-w-none px-5 py-4 min-h-[240px] text-gray-900 dark:text-white focus:outline-none" />

    </div>
</template>

<style>
.tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    pointer-events: none;
    height: 0;
}

.tiptap:focus {
    outline: none;
}

.mention-chip {
    @apply bg-primary/10 text-primary rounded px-1 py-0.5 font-medium text-sm;
}
</style>
<template>
  <div class="document-editor">
    <div class="metadata-panel">
      <input
        v-model="metadata.title"
        type="text"
        placeholder="Document Title"
        class="title-input"
        @input="handleMetadataChange"
      />
      <div class="metadata-row">
        <select
          v-model="metadata.type"
          class="type-select"
          @change="handleMetadataChange"
        >
          <option value="topic">Topic</option>
          <option value="concept">Concept</option>
          <option value="task">Task</option>
          <option value="reference">Reference</option>
        </select>
        <input
          v-model="metadata.version"
          type="text"
          placeholder="Version"
          class="version-input"
          @input="handleMetadataChange"
        />
      </div>
      <input
        v-model="metadata.author"
        type="text"
        placeholder="Author"
        class="author-input"
        @input="handleMetadataChange"
      />
      <textarea
        v-model="metadata.description"
        placeholder="Description"
        class="description-input"
        @input="handleMetadataChange"
      />
    </div>

    <MenuBar v-if="editor" :editor="editor" />

    <div class="editor-container">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { NoteNode } from '../extensions/NoteNode'
import { WarningNode } from '../extensions/WarningNode'
import { ExampleNode } from '../extensions/ExampleNode'
import { Document } from '../types/documentation'
import { tiptapToDocument, documentToTiptap } from '../utils/jsonConverter'
import MenuBar from './MenuBar.vue'

interface Props {
  initialDocument?: Document
}

const props = defineProps<Props>()
const emit = defineEmits<{
  change: [document: Document]
}>()

const metadata = ref({
  title: props.initialDocument?.topic.metadata.title || 'Untitled Document',
  type: props.initialDocument?.topic.metadata.type || ('topic' as const),
  version: props.initialDocument?.topic.metadata.version || '1.0',
  author: props.initialDocument?.topic.metadata.author || '',
  description: props.initialDocument?.topic.metadata.description || '',
})

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Underline,
    Highlight,
    Link.configure({
      openOnClick: false,
    }),
    NoteNode,
    WarningNode,
    ExampleNode,
  ],
  content: props.initialDocument
    ? documentToTiptap(props.initialDocument)
    : '<p>Start writing...</p>',
  onUpdate: () => {
    handleEditorUpdate()
  },
})

const handleMetadataChange = () => {
  handleEditorUpdate()
}

const handleEditorUpdate = () => {
  if (editor.value) {
    const tiptapJson = editor.value.getJSON()
    const document = tiptapToDocument(tiptapJson, metadata.value)
    emit('change', document)
  }
}

// Watch for initialDocument changes (when importing)
watch(
  () => props.initialDocument,
  (newDoc) => {
    if (newDoc && editor.value) {
      metadata.value = {
        title: newDoc.topic.metadata.title || 'Untitled Document',
        type: newDoc.topic.metadata.type || ('topic' as const),
        version: newDoc.topic.metadata.version || '1.0',
        author: newDoc.topic.metadata.author || '',
        description: newDoc.topic.metadata.description || '',
      }
      const content = documentToTiptap(newDoc)
      editor.value.commands.setContent(content)
    }
  }
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

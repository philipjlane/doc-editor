<template>
  <main class="main-container">
    <header class="header">
      <h1>Tiptap JSON Documentation Editor</h1>
      <p class="subtitle">DITA-like structured technical documentation</p>
      <div class="header-actions">
        <button @click="showJson = !showJson" class="btn">
          {{ showJson ? 'Hide' : 'Show' }} JSON
        </button>
        <button @click="handleExport" class="btn" :disabled="!document">
          Export JSON
        </button>
        <label class="btn">
          Import JSON
          <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            @change="handleImport"
            style="display: none"
          />
        </label>
      </div>
    </header>

    <div class="content-container">
      <div class="editor-section">
        <DocumentEditor
          :key="editorKey"
          :initialDocument="importedDocument || undefined"
          @change="handleDocumentChange"
        />
      </div>

      <div v-if="showJson" class="json-section">
        <h2>JSON Output</h2>
        <pre class="json-preview">{{
          document ? JSON.stringify(document, null, 2) : 'No document yet'
        }}</pre>
      </div>
    </div>

    <footer class="footer">
      <p>
        Built with <strong>Tiptap/ProseMirror</strong> • JSON format inspired by
        <strong>DITA</strong>
      </p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DocumentEditor from './components/DocumentEditor.vue'
import { Document } from './types/documentation'

const document = ref<Document | null>(null)
const importedDocument = ref<Document | null>(null)
const showJson = ref(false)
const editorKey = ref(0)
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleDocumentChange = (doc: Document) => {
  document.value = doc
}

const handleExport = () => {
  if (document.value) {
    const blob = new Blob([JSON.stringify(document.value, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = `${document.value.topic.metadata.title.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

const handleImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        // Validate basic structure
        if (!json.topic || !json.topic.metadata) {
          alert('Invalid document format: missing topic or metadata')
          return
        }
        // Set the imported document and increment key to force editor remount
        importedDocument.value = json
        document.value = json
        editorKey.value++
        // Reset file input so the same file can be imported again
        if (fileInputRef.value) {
          fileInputRef.value.value = ''
        }
      } catch (error) {
        alert(
          'Invalid JSON file: ' +
            (error instanceof Error ? error.message : 'Unknown error')
        )
      }
    }
    reader.readAsText(file)
  }
}
</script>

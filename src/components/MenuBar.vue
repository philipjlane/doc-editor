<template>
  <div class="menu-bar">
    <div class="menu-group">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        title="Bold"
      >
        B
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        title="Italic"
      >
        I
      </button>
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }"
        title="Underline"
      >
        U
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        title="Strikethrough"
      >
        S
      </button>
    </div>

    <div class="menu-group">
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        H1
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        H2
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        H3
      </button>
    </div>

    <div class="menu-group">
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        title="Bullet List"
      >
        • List
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        title="Numbered List"
      >
        1. List
      </button>
    </div>

    <div class="menu-group">
      <button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        title="Code Block"
      >
        &lt;/&gt;
      </button>
      <button
        @click="editor.chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
        title="Inline Code"
      >
        Code
      </button>
      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        title="Blockquote"
      >
        Quote
      </button>
    </div>

    <div class="menu-group">
      <button
        @click="editor.chain().focus().toggleNote('note').run()"
        :class="{ 'is-active': editor.isActive('note') }"
        title="Note"
      >
        Note
      </button>
      <button
        @click="editor.chain().focus().toggleNote('tip').run()"
        :class="{ 'is-active': editor.isActive('note', { noteType: 'tip' }) }"
        title="Tip"
      >
        Tip
      </button>
      <button
        @click="editor.chain().focus().toggleWarning('warning').run()"
        :class="{ 'is-active': editor.isActive('warning') }"
        title="Warning"
      >
        Warning
      </button>
      <button
        @click="editor.chain().focus().toggleExample().run()"
        :class="{ 'is-active': editor.isActive('example') }"
        title="Example"
      >
        Example
      </button>
    </div>

    <div class="menu-group">
      <button
        @click="editor.chain().focus().toggleHighlight().run()"
        :class="{ 'is-active': editor.isActive('highlight') }"
        title="Highlight"
      >
        Highlight
      </button>
    </div>

    <div class="menu-group">
      <button @click="editor.chain().focus().undo().run()" title="Undo">
        Undo
      </button>
      <button @click="editor.chain().focus().redo().run()" title="Redo">
        Redo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'

interface Props {
  editor: Editor
}

defineProps<Props>()
</script>

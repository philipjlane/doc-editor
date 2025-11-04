'use client';

import React from 'react';
import { Editor } from '@tiptap/react';

interface MenuBarProps {
  editor: Editor;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar">
      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline"
        >
          U
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
        >
          S
        </button>
      </div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
      </div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          1. List
        </button>
      </div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          title="Code Block"
        >
          {'</>'}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
          title="Inline Code"
        >
          Code
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Blockquote"
        >
          Quote
        </button>
      </div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleNote('note').run()}
          className={editor.isActive('note') ? 'is-active' : ''}
          title="Note"
        >
          Note
        </button>
        <button
          onClick={() => editor.chain().focus().toggleNote('tip').run()}
          className={editor.isActive('note', { noteType: 'tip' }) ? 'is-active' : ''}
          title="Tip"
        >
          Tip
        </button>
        <button
          onClick={() => editor.chain().focus().toggleWarning('warning').run()}
          className={editor.isActive('warning') ? 'is-active' : ''}
          title="Warning"
        >
          Warning
        </button>
        <button
          onClick={() => editor.chain().focus().toggleExample().run()}
          className={editor.isActive('example') ? 'is-active' : ''}
          title="Example"
        >
          Example
        </button>
      </div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'is-active' : ''}
          title="Highlight"
        >
          Highlight
        </button>
      </div>

      <div className="menu-group">
        <button onClick={() => editor.chain().focus().undo().run()} title="Undo">
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} title="Redo">
          Redo
        </button>
      </div>
    </div>
  );
};

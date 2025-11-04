'use client';

import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { NoteNode } from '../extensions/NoteNode';
import { WarningNode } from '../extensions/WarningNode';
import { ExampleNode } from '../extensions/ExampleNode';
import { Document } from '../types/documentation';
import { tiptapToDocument, documentToTiptap } from '../utils/jsonConverter';
import { MenuBar } from './MenuBar';

interface DocumentEditorProps {
  initialDocument?: Document;
  onChange?: (document: Document) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialDocument,
  onChange,
}) => {
  const [metadata, setMetadata] = useState(
    initialDocument?.topic.metadata || {
      title: 'Untitled Document',
      type: 'topic' as const,
      version: '1.0',
    }
  );

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
    content: initialDocument ? documentToTiptap(initialDocument) : '<p>Start writing...</p>',
    onUpdate: ({ editor }) => {
      if (onChange) {
        const tiptapJson = editor.getJSON();
        const document = tiptapToDocument(tiptapJson, metadata);
        onChange(document);
      }
    },
  });

  const handleMetadataChange = useCallback(
    (field: string, value: any) => {
      const newMetadata = { ...metadata, [field]: value };
      setMetadata(newMetadata);
      if (onChange && editor) {
        const tiptapJson = editor.getJSON();
        const document = tiptapToDocument(tiptapJson, newMetadata);
        onChange(document);
      }
    },
    [metadata, onChange, editor]
  );

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="document-editor">
      <div className="metadata-panel">
        <input
          type="text"
          placeholder="Document Title"
          value={metadata.title}
          onChange={e => handleMetadataChange('title', e.target.value)}
          className="title-input"
        />
        <div className="metadata-row">
          <select
            value={metadata.type || 'topic'}
            onChange={e => handleMetadataChange('type', e.target.value)}
            className="type-select"
          >
            <option value="topic">Topic</option>
            <option value="concept">Concept</option>
            <option value="task">Task</option>
            <option value="reference">Reference</option>
          </select>
          <input
            type="text"
            placeholder="Version"
            value={metadata.version || ''}
            onChange={e => handleMetadataChange('version', e.target.value)}
            className="version-input"
          />
        </div>
        <input
          type="text"
          placeholder="Author"
          value={metadata.author || ''}
          onChange={e => handleMetadataChange('author', e.target.value)}
          className="author-input"
        />
        <textarea
          placeholder="Description"
          value={metadata.description || ''}
          onChange={e => handleMetadataChange('description', e.target.value)}
          className="description-input"
        />
      </div>

      <MenuBar editor={editor} />

      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

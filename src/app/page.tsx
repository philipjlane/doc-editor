'use client';

import React, { useState } from 'react';
import { DocumentEditor } from '../components/DocumentEditor';
import { Document } from '../types/documentation';

export default function Home() {
  const [document, setDocument] = useState<Document | null>(null);
  const [showJson, setShowJson] = useState(false);

  const handleDocumentChange = (doc: Document) => {
    setDocument(doc);
  };

  const handleExport = () => {
    if (document) {
      const blob = new Blob([JSON.stringify(document, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.topic.metadata.title.replace(/\s+/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setDocument(json);
          // Force re-render by creating new component instance
          window.location.reload();
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <main className="main-container">
      <header className="header">
        <h1>Tiptap JSON Documentation Editor</h1>
        <p className="subtitle">DITA-like structured technical documentation</p>
        <div className="header-actions">
          <button onClick={() => setShowJson(!showJson)} className="btn">
            {showJson ? 'Hide' : 'Show'} JSON
          </button>
          <button onClick={handleExport} className="btn" disabled={!document}>
            Export JSON
          </button>
          <label className="btn">
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </header>

      <div className="content-container">
        <div className="editor-section">
          <DocumentEditor onChange={handleDocumentChange} />
        </div>

        {showJson && (
          <div className="json-section">
            <h2>JSON Output</h2>
            <pre className="json-preview">
              {document ? JSON.stringify(document, null, 2) : 'No document yet'}
            </pre>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>
          Built with <strong>Tiptap/ProseMirror</strong> • JSON format inspired by{' '}
          <strong>DITA</strong>
        </p>
      </footer>
    </main>
  );
}

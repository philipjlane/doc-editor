# Tiptap JSON Documentation Editor

A modern technical documentation editor built with Tiptap/ProseMirror that uses a JSON-based format similar to DITA (Darwin Information Typing Architecture).

## Features

- **DITA-like JSON Format**: Structured documentation with topics, concepts, tasks, and references
- **Rich Text Editing**: Full-featured editor powered by Tiptap/ProseMirror
- **Semantic Structure**: Support for technical documentation elements (notes, warnings, code blocks, etc.)
- **JSON Export/Import**: Easy serialization between editor state and JSON format
- **Type Safety**: Built with TypeScript for reliability

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## JSON Documentation Format

The editor works with a structured JSON format that includes:
- **Topics**: Main content containers with types (concept, task, reference)
- **Sections**: Organized content blocks
- **Semantic Elements**: Notes, warnings, examples, code blocks
- **Metadata**: Title, description, author, version information

## Technology Stack

- Next.js 14
- React 18
- Tiptap/ProseMirror
- TypeScript

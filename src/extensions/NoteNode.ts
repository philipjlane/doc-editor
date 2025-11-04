import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export interface NoteOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    note: {
      setNote: (noteType?: 'note' | 'tip' | 'important') => ReturnType;
      toggleNote: (noteType?: 'note' | 'tip' | 'important') => ReturnType;
    };
  }
}

export const NoteNode = Node.create<NoteOptions>({
  name: 'note',

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      noteType: {
        default: 'note',
        parseHTML: element => element.getAttribute('data-note-type') || 'note',
        renderHTML: attributes => ({
          'data-note-type': attributes.noteType,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="note"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'note',
        class: `note note-${HTMLAttributes['data-note-type'] || 'note'}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setNote:
        (noteType = 'note') =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { noteType });
        },
      toggleNote:
        (noteType = 'note') =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, { noteType });
        },
    };
  },
});

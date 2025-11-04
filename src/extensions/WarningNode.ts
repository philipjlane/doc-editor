import { Node, mergeAttributes } from '@tiptap/core';

export interface WarningOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    warning: {
      setWarning: (warningType?: 'warning' | 'caution' | 'danger') => ReturnType;
      toggleWarning: (warningType?: 'warning' | 'caution' | 'danger') => ReturnType;
    };
  }
}

export const WarningNode = Node.create<WarningOptions>({
  name: 'warning',

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      warningType: {
        default: 'warning',
        parseHTML: element => element.getAttribute('data-warning-type') || 'warning',
        renderHTML: attributes => ({
          'data-warning-type': attributes.warningType,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="warning"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'warning',
        class: `warning warning-${HTMLAttributes['data-warning-type'] || 'warning'}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setWarning:
        (warningType = 'warning') =>
        ({ commands }) => {
          return commands.wrapIn(this.name, { warningType });
        },
      toggleWarning:
        (warningType = 'warning') =>
        ({ commands }) => {
          return commands.toggleWrap(this.name, { warningType });
        },
    };
  },
});

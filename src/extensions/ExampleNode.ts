import { Node, mergeAttributes } from '@tiptap/core';

export interface ExampleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    example: {
      setExample: () => ReturnType;
      toggleExample: () => ReturnType;
    };
  }
}

export const ExampleNode = Node.create<ExampleOptions>({
  name: 'example',

  group: 'block',

  content: 'block+',

  defining: true,

  addAttributes() {
    return {
      title: {
        default: null,
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {};
          }
          return {
            'data-title': attributes.title,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="example"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'example',
        class: 'example',
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setExample:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name);
        },
      toggleExample:
        () =>
        ({ commands }) => {
          return commands.toggleWrap(this.name);
        },
    };
  },
});

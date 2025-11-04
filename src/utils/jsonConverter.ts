/**
 * Converts between ProseMirror/Tiptap JSON and DITA-like JSON format
 */

import { JSONContent } from '@tiptap/core';
import {
  Document,
  Topic,
  ContentElement,
  TextNode,
  ParagraphElement,
  HeadingElement,
  ListElement,
  CodeBlockElement,
  BlockquoteElement,
  NoteElement,
  WarningElement,
  ExampleElement,
  Section,
  TextStyle,
} from '../types/documentation';

/**
 * Convert Tiptap JSON to DITA-like JSON format
 */
export function tiptapToDocument(tiptapJson: JSONContent, metadata?: any): Document {
  const sections: Section[] = [];
  let currentSection: Section = { content: [] };

  if (tiptapJson.content) {
    for (const node of tiptapJson.content) {
      const element = convertTiptapNode(node);
      if (element) {
        // Start new section on H1 headings
        if (element.type === 'heading' && (element as HeadingElement).level === 1) {
          if (currentSection.content.length > 0) {
            sections.push(currentSection);
          }
          currentSection = {
            title: extractTextContent(element),
            content: [],
          };
        } else {
          currentSection.content.push(element);
        }
      }
    }
  }

  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  const topicType = metadata?.type || 'topic';
  const topic: Topic = {
    type: topicType,
    metadata: {
      title: metadata?.title || 'Untitled Document',
      type: topicType,
      description: metadata?.description,
      author: metadata?.author,
      version: metadata?.version || '1.0',
      created: metadata?.created || new Date().toISOString(),
      modified: new Date().toISOString(),
      tags: metadata?.tags || [],
    },
    sections: sections.length > 0 ? sections : [{ content: [] }],
  };

  return {
    version: '1.0',
    topic,
  };
}

/**
 * Convert DITA-like JSON to Tiptap JSON format
 */
export function documentToTiptap(doc: Document): JSONContent {
  const content: JSONContent[] = [];

  for (const section of doc.topic.sections) {
    // Add section title as H1 if present
    if (section.title) {
      content.push({
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: section.title }],
      });
    }

    // Convert section content
    for (const element of section.content) {
      const tiptapNode = convertDocumentElement(element);
      if (tiptapNode) {
        content.push(tiptapNode);
      }
    }
  }

  return {
    type: 'doc',
    content: content.length > 0 ? content : [{ type: 'paragraph' }],
  };
}

/**
 * Convert a single Tiptap node to document element
 */
function convertTiptapNode(node: JSONContent): ContentElement | null {
  switch (node.type) {
    case 'paragraph':
      return {
        type: 'paragraph',
        content: node.content ? convertInlineContent(node.content) : [],
      } as ParagraphElement;

    case 'heading':
      return {
        type: 'heading',
        level: node.attrs?.level || 1,
        content: node.content ? convertInlineContent(node.content) : [],
      } as HeadingElement;

    case 'bulletList':
    case 'orderedList':
      return {
        type: 'list',
        ordered: node.type === 'orderedList',
        content: node.content?.map(item => ({
          type: 'listItem' as const,
          content: item.content?.map(convertTiptapNode).filter(Boolean) as ContentElement[],
        })) || [],
      } as ListElement;

    case 'codeBlock':
      return {
        type: 'codeBlock',
        language: node.attrs?.language,
        content: extractTextContent(node),
      } as CodeBlockElement;

    case 'blockquote':
      return {
        type: 'blockquote',
        content: node.content?.map(convertTiptapNode).filter(Boolean) as ContentElement[],
      } as BlockquoteElement;

    case 'note':
      return {
        type: 'note',
        noteType: node.attrs?.noteType || 'note',
        content: node.content?.map(convertTiptapNode).filter(Boolean) as ContentElement[],
      } as NoteElement;

    case 'warning':
      return {
        type: 'warning',
        warningType: node.attrs?.warningType || 'warning',
        content: node.content?.map(convertTiptapNode).filter(Boolean) as ContentElement[],
      } as WarningElement;

    case 'example':
      return {
        type: 'example',
        title: node.attrs?.title,
        content: node.content?.map(convertTiptapNode).filter(Boolean) as ContentElement[],
      } as ExampleElement;

    default:
      return null;
  }
}

/**
 * Convert document element to Tiptap node
 */
function convertDocumentElement(element: ContentElement): JSONContent | null {
  switch (element.type) {
    case 'paragraph':
      return {
        type: 'paragraph',
        content: convertDocumentInlineContent((element as ParagraphElement).content),
      };

    case 'heading':
      const heading = element as HeadingElement;
      return {
        type: 'heading',
        attrs: { level: heading.level },
        content: convertDocumentInlineContent(heading.content),
      };

    case 'list':
      const list = element as ListElement;
      return {
        type: list.ordered ? 'orderedList' : 'bulletList',
        content: list.content.map(item => ({
          type: 'listItem',
          content: item.content.map(convertDocumentElement).filter(Boolean) as JSONContent[],
        })),
      };

    case 'codeBlock':
      const codeBlock = element as CodeBlockElement;
      return {
        type: 'codeBlock',
        attrs: { language: codeBlock.language },
        content: [{ type: 'text', text: codeBlock.content }],
      };

    case 'blockquote':
      const blockquote = element as BlockquoteElement;
      return {
        type: 'blockquote',
        content: blockquote.content.map(convertDocumentElement).filter(Boolean) as JSONContent[],
      };

    case 'note':
      const note = element as NoteElement;
      return {
        type: 'note',
        attrs: { noteType: note.noteType },
        content: note.content.map(convertDocumentElement).filter(Boolean) as JSONContent[],
      };

    case 'warning':
      const warning = element as WarningElement;
      return {
        type: 'warning',
        attrs: { warningType: warning.warningType },
        content: warning.content.map(convertDocumentElement).filter(Boolean) as JSONContent[],
      };

    case 'example':
      const example = element as ExampleElement;
      return {
        type: 'example',
        attrs: { title: example.title },
        content: example.content.map(convertDocumentElement).filter(Boolean) as JSONContent[],
      };

    default:
      return null;
  }
}

/**
 * Convert inline content from Tiptap format
 */
function convertInlineContent(content: JSONContent[]): TextNode[] {
  return content.map(node => {
    const textNode: TextNode = {
      type: 'text',
      text: node.text || '',
    };

    if (node.marks && node.marks.length > 0) {
      textNode.styles = {};
      for (const mark of node.marks) {
        switch (mark.type) {
          case 'bold':
            textNode.styles.bold = true;
            break;
          case 'italic':
            textNode.styles.italic = true;
            break;
          case 'underline':
            textNode.styles.underline = true;
            break;
          case 'strike':
            textNode.styles.strike = true;
            break;
          case 'code':
            textNode.styles.code = true;
            break;
          case 'highlight':
            textNode.styles.highlight = true;
            break;
          case 'link':
            textNode.href = mark.attrs?.href;
            break;
        }
      }
    }

    return textNode;
  });
}

/**
 * Convert inline content to Tiptap format
 */
function convertDocumentInlineContent(content?: TextNode[]): JSONContent[] {
  if (!content) return [];

  return content.map(textNode => {
    const node: JSONContent = {
      type: 'text',
      text: textNode.text,
    };

    const marks: any[] = [];

    if (textNode.styles) {
      if (textNode.styles.bold) marks.push({ type: 'bold' });
      if (textNode.styles.italic) marks.push({ type: 'italic' });
      if (textNode.styles.underline) marks.push({ type: 'underline' });
      if (textNode.styles.strike) marks.push({ type: 'strike' });
      if (textNode.styles.code) marks.push({ type: 'code' });
      if (textNode.styles.highlight) marks.push({ type: 'highlight' });
    }

    if (textNode.href) {
      marks.push({ type: 'link', attrs: { href: textNode.href } });
    }

    if (marks.length > 0) {
      node.marks = marks;
    }

    return node;
  });
}

/**
 * Extract plain text content from a node
 */
function extractTextContent(node: any): string {
  if (typeof node === 'string') return node;
  if (node.text) return node.text;
  if (node.content) {
    return node.content.map(extractTextContent).join('');
  }
  return '';
}

/**
 * DITA-like JSON Documentation Format
 *
 * This format is inspired by DITA (Darwin Information Typing Architecture)
 * and provides a structured approach to technical documentation.
 */

export type TopicType = 'concept' | 'task' | 'reference' | 'topic';

export type ElementType =
  | 'paragraph'
  | 'heading'
  | 'list'
  | 'listItem'
  | 'codeBlock'
  | 'blockquote'
  | 'note'
  | 'warning'
  | 'example'
  | 'table'
  | 'image';

export type TextStyle = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  highlight?: boolean;
};

export interface TextNode {
  type: 'text';
  text: string;
  styles?: TextStyle;
  href?: string; // For links
}

export interface BaseElement {
  id?: string;
  type: ElementType;
  attrs?: Record<string, any>;
}

export interface ParagraphElement extends BaseElement {
  type: 'paragraph';
  content?: Array<TextNode | InlineElement>;
}

export interface HeadingElement extends BaseElement {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content?: Array<TextNode | InlineElement>;
}

export interface ListElement extends BaseElement {
  type: 'list';
  ordered: boolean;
  content: ListItemElement[];
}

export interface ListItemElement extends BaseElement {
  type: 'listItem';
  content: ContentElement[];
}

export interface CodeBlockElement extends BaseElement {
  type: 'codeBlock';
  language?: string;
  content: string;
}

export interface BlockquoteElement extends BaseElement {
  type: 'blockquote';
  content: ContentElement[];
}

export interface NoteElement extends BaseElement {
  type: 'note';
  noteType: 'note' | 'tip' | 'important';
  content: ContentElement[];
}

export interface WarningElement extends BaseElement {
  type: 'warning';
  warningType: 'warning' | 'caution' | 'danger';
  content: ContentElement[];
}

export interface ExampleElement extends BaseElement {
  type: 'example';
  title?: string;
  content: ContentElement[];
}

export type InlineElement = TextNode;

export type ContentElement =
  | ParagraphElement
  | HeadingElement
  | ListElement
  | ListItemElement
  | CodeBlockElement
  | BlockquoteElement
  | NoteElement
  | WarningElement
  | ExampleElement;

export interface Section {
  id?: string;
  title?: string;
  content: ContentElement[];
}

export interface Metadata {
  title: string;
  type?: TopicType;
  description?: string;
  author?: string;
  version?: string;
  created?: string;
  modified?: string;
  tags?: string[];
}

export interface Topic {
  type: TopicType;
  metadata: Metadata;
  sections: Section[];
}

export interface Document {
  version: '1.0';
  topic: Topic;
}

/**
 * Helper type for the editor state
 */
export interface EditorDocument {
  json: Document;
  lastModified: Date;
}

import React, { useEffect, useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import styled from 'styled-components';
import { appTheme } from '../../project/brand/project';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Image as ImageIcon,
  Code,
  Palette,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Code2,
} from 'lucide-react';

// Create a lowlight instance with common languages
const lowlight = createLowlight(common);

const MenuBar = ({ editor, showHtml, onToggleHtml }) => {
  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files?.[0]) {
        try {
          // Here you would typically upload to your server/S3
          // For now, we'll use object URL
          const url = URL.createObjectURL(input.files[0]);
          editor?.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <MenuWrapper>
      <ButtonGroup>
        <ToolbarButton
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          <Heading3 size={18} />
        </ToolbarButton>
      </ButtonGroup>

      <Divider />

      <ButtonGroup>
        <ToolbarButton
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          <Strikethrough size={18} />
        </ToolbarButton>
      </ButtonGroup>

      <Divider />

      <ButtonGroup>
        <ToolbarButton
          title="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Ordered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <ListOrdered size={18} />
        </ToolbarButton>
      </ButtonGroup>

      <Divider />

      <ButtonGroup>
        <ToolbarButton
          title="Upload Image"
          onClick={addImage}
        >
          <ImageIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          <Code size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Add Link"
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={editor.isActive('link') ? 'is-active' : ''}
        >
          <LinkIcon size={18} />
        </ToolbarButton>
      </ButtonGroup>

      <Divider />

      <ButtonGroup>
        <ToolbarButton
          title="Align Left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Align Center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        >
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Align Right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        >
          <AlignRight size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
        >
          <AlignJustify size={18} />
        </ToolbarButton>
      </ButtonGroup>

      <Divider />

      <ButtonGroup>
        <ColorPickerWrapper>
          <ColorPicker
            type="color"
            title="Text Color"
            onInput={event => editor.chain().focus().setColor(event.target.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
          />
          <ColorPickerIcon>
            <Palette size={18} />
          </ColorPickerIcon>
        </ColorPickerWrapper>
      </ButtonGroup>

      <Divider />

      <ButtonGroup>
        <ToolbarButton
          title="Toggle HTML View"
          onClick={onToggleHtml}
          className={showHtml ? 'is-active' : ''}
        >
          <Code2 size={18} />
        </ToolbarButton>
      </ButtonGroup>
    </MenuWrapper>
  );
};

const TiptapEditor = ({ 
  value, 
  onChange, 
  placeholder,
  onFocus,
  onBlur,
  fullScreen,
}) => {
  const [showHtml, setShowHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Color,
      TextStyle,
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onChange?.(html);
    },
    onFocus: () => onFocus?.(),
    onBlur: () => onBlur?.(),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
      setHtmlContent(value || '');
    }
  }, [value, editor]);

  const handleHtmlChange = (e) => {
    const newHtml = e.target.value;
    setHtmlContent(newHtml);
    if (editor) {
      editor.commands.setContent(newHtml);
    }
    onChange?.(newHtml);
  };

  const toggleHtml = useCallback(() => {
    setShowHtml(prev => !prev);
  }, []);

  return (
    <EditorWrapper className={fullScreen ? "fullscreen" : ""}>
      <MenuBar editor={editor} showHtml={showHtml} onToggleHtml={toggleHtml} />
      <ContentWrapper>
        {showHtml ? (
          <HtmlEditor
            value={htmlContent}
            onChange={handleHtmlChange}
            placeholder="Enter HTML content..."
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </ContentWrapper>
    </EditorWrapper>
  );
};

// Styled Components
const EditorWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: auto;
  background: white;
  margin-top: 15px;
  &.fullscreen {
    margin-top: 0px;
  }
  &:focus-within {
    border-color: ${appTheme.primary.main};
  }
`;

const MenuWrapper = styled.div`
  padding: 4px;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 2px;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: #e0e0e0;
  margin: 0 8px;
`;

const ToolbarButton = styled.button`
  border: none;
  background: transparent;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${appTheme.text.soft};
  transition: all 0.2s;
  font-weight: 500;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    background: ${appTheme.primary.light}40;
    color: ${appTheme.primary.main};
  }

  &.is-active {
    background: ${appTheme.primary.light}40;
    color: ${appTheme.primary.main};
    font-weight: 600;
    box-shadow: inset 0 0 0 1px ${appTheme.primary.main}40;

    svg {
      stroke-width: 2.5;
    }
  }
`;

const ColorPickerWrapper = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

const ColorPickerIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  color: ${appTheme.text.soft};
`;

const ColorPicker = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0;

  &:hover + ${ColorPickerIcon} {
    color: ${appTheme.primary.main};
  }
`;

const ContentWrapper = styled.div`
  .ProseMirror {
    padding: 16px;
    min-height: 200px;
    outline: none;
    font-family: inherit;

    > * + * {
      margin-top: 0.75em;
    }

    ul, ol {
      padding: 0 1rem;
    }

    h1 {
      font-size: 2em;
      font-weight: 600;
      line-height: 1.3;
      margin: 1em 0 0.5em;
    }

    h2 {
      font-size: 1.5em;
      font-weight: 600;
      line-height: 1.35;
      margin: 1em 0 0.5em;
    }

    h3 {
      font-size: 1.25em;
      font-weight: 600;
      line-height: 1.4;
      margin: 1em 0 0.5em;
    }

    p {
      margin: 0.5em 0;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    code {
      background-color: #f8f9fa;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
    }

    pre {
      background: #2d2d2d;
      color: #fff;
      padding: 0.75em 1em;
      border-radius: 6px;
      font-family: monospace;
      font-size: 0.9em;
      overflow-x: auto;
    }

    .editor-image {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1em 0;
      border-radius: 4px;
    }

    &:focus {
      outline: none;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #adb5bd;
      pointer-events: none;
      height: 0;
    }
  }
`;

const HtmlEditor = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: none;
  outline: none;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  background: #1e1e1e;
  color: #d4d4d4;
  tab-size: 2;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
  }
`;

export default TiptapEditor;
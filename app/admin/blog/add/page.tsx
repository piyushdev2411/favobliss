"use client";

import {
  useEditor,
  EditorContent,
  Editor as TiptapEditor,
} from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import TextAlign from "@tiptap/extension-text-align";
import ResizableImageExtension from "@/components/BlogsEditor/ImageResizer";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import FontSize from "tiptap-extension-font-size";
import FontFamily from "@tiptap/extension-font-family";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { TextStyle } from "@tiptap/extension-text-style";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import CodeBlock from "@tiptap/extension-code-block";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { all, createLowlight } from "lowlight";
import Menu from "@/components/BlogsEditor/Menu";
import Header from "@/components/BlogsEditor/Header";
import BlockMenu from "@/components/BlogsEditor/BlockMenu";
import ContextMenu from "@/components/BlogsEditor/ContextMenu";
import useContextMenu from "@/hooks/editor/useContextMenu";
import useIndexedDB from "@/hooks/editor/useIndexDB";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const lowlight = createLowlight(all);

const Editor = () => {
  const params = useParams();
  const id = params.id as string;
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, clientY: 0 });
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const { saveDocument, getDocument } = useIndexedDB();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      CodeBlock,
      Link,
      Highlight.configure({ multicolor: true }),
      Color,
      Heading.configure({
        levels: [1, 2, 3, 4, 5],
      }),
      Paragraph,
      TextStyle,
      FontSize as any,
      ResizableImageExtension,
      FontFamily,
      TaskList.configure({
        HTMLAttributes: {
          class: "task-list",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "task-item",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Superscript,
      Typography,
      Subscript,
      HorizontalRule,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: "@Start Something…",
      }),
      CharacterCount,
    ],
    immediatelyRender: false,
    content: "",
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      if (id) {
        saveDocument(id, jsonContent);
      }
    },
  });

  useEffect(() => {
    const loadContent = async () => {
      if (id && editor) {
        const savedContent = await getDocument(id);
        if (savedContent) {
          editor.commands.setContent(savedContent);
        }
      }
    };

    loadContent();
  }, [editor, id, getDocument]);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!showFormatMenu && !showActionMenu) {
      const editorRect = event.currentTarget.getBoundingClientRect();
      const newTop = Math.min(
        Math.max(event.clientY - editorRect.top, 0),
        editorRect.height - 50
      );

      setButtonPosition({
        top: newTop,
        clientY: event.clientY,
      });
    }
    setShowSideMenu(true);
  };

  const {
    contextMenuVisible,
    menuPosition,
    handleContextMenu,
    setContextMenuVisible,
    handleTouchStart,
    handleTouchEnd,
  } = useContextMenu(editor as TiptapEditor);

  if (!editor) {
    return null;
  }

  const handleTableAction = (action: string) => {
    switch (action) {
      case "addRowAfter":
        editor.chain().focus().addRowAfter().run();
        break;
      case "addColumnAfter":
        editor.chain().focus().addColumnAfter().run();
        break;
      case "deleteRow":
        editor.chain().focus().deleteRow().run();
        break;
      case "deleteColumn":
        editor.chain().focus().deleteColumn().run();
        break;
      case "deleteTable":
        editor.chain().focus().deleteTable().run();
        break;
      default:
        break;
    }
    setContextMenuVisible(false);
  };

  return (
    <div className="relative">
      <Menu editor={editor} />
      <Header editor={editor} />
      <div className="p-6 md:p-8 bg-[#e0e0e0]">
        <div
          onMouseLeave={() => setShowSideMenu(false)}
          className="relative max-w-4xl mx-auto"
        >
          {showSideMenu && (
            <BlockMenu
              editor={editor}
              buttonPosition={buttonPosition}
              showActionMenu={showActionMenu}
              showFormatMenu={showFormatMenu}
              setShowActionMenu={setShowActionMenu}
              setShowFormatMenu={setShowFormatMenu}
            />
          )}
          <div
            className="rounded-md p-8 mt-4 max-w-[794px] min-h-[71vh] mx-auto bg-white shadow-2xl iceDriveEditor"
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseMove={handleMouseMove}
          >
            <EditorContent editor={editor} className="focus:outline-none" />
          </div>
        </div>
        <ContextMenu
          position={menuPosition}
          visible={contextMenuVisible}
          onAction={handleTableAction}
        />
      </div>
      <div className="fixed right-4 top-[90vh] flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          {editor.storage.characterCount.characters()} characters
        </p>
        <p className="text-sm text-gray-500">
          {editor.storage.characterCount.words()} words
        </p>
      </div>
    </div>
  );
};

export default Editor;

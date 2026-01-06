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
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import useIndexedDB from "@/hooks/editor/useIndexDB";
import { PencilSimple, Trash } from "@phosphor-icons/react";

const lowlight = createLowlight(all);

const Editor = () => {
  const params = useParams();
  const blogId = params.blogId as string;
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, clientY: 0 });
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [title, setTitle] = useState("Untitled Document");
  const [showUrl, setShowUrl] = useState(false);
  const [isLinkEditing, setIsLinkEditing] = useState<boolean>(false);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [linkMenuPosition, setLinkMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const { saveDocument } = useIndexedDB();
  const router = useRouter();

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
      if (blogId) {
        saveDocument(blogId, jsonContent);
      }
    },
  });

  const saveDocuemnt = async () => {
    try {
      setLoading(true);
      if (editor) {
        // const jsonContent = editor.getJSON();
        const htmlContent = editor.getHTML();
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: htmlContent, published: false }),
        });
        if (!response.ok) {
          toast.error("Failed to save blog");
        } else {
          toast.success("Blog saved successfully");
          router.push(`/admin/blog`);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const publishDocument = async () => {
    try {
      setLoading(true);
      if (editor) {
        const htmlContent = editor.getHTML();
        const response = await fetch(`/api/blogs/${blogId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: htmlContent, published: true }),
        });
        if (!response.ok) {
          toast.error("Failed to save blog");
        } else {
          toast.success("Blog saved successfully");
          router.push(`/admin/blog`);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const positionMenu = (editor: TiptapEditor) => {
    const { from } = editor.state.selection;
    const startPos = editor.view.coordsAtPos(from);

    const editorContainer = editorContainerRef.current?.getBoundingClientRect();
    if (editorContainer) {
      const top = startPos.top - editorContainer.top - 50;
      const left = startPos.left - editorContainer.left;
      setLinkMenuPosition({ top, left });
    }
  };

  const unsetLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
      setIsLinkEditing(false);
    }
  };

  useEffect(() => {
    if (!editor) return;
    const handleTransaction = () => {
      const isLinkActive = editor.isActive("link");
      setIsLinkEditing(isLinkActive);
      if (isLinkActive) {
        positionMenu(editor);
      }
    };
    editor.on("transaction", handleTransaction);
    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor]);

  useEffect(() => {
    const loadContent = async () => {
      if (blogId && editor) {
        try {
          setLoading(true);
          const response = await fetch(`/api/blogs/${blogId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch blog");
          }
          const blog = await response.json();
          editor.commands.setContent(blog.content);
          setTitle(blog.title || "Untitled Document");
        } catch (error) {
          toast.error("Failed to load blog");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadContent();
  }, [editor, blogId]);

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
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <Menu editor={editor} />
      <Header
        editor={editor}
        saveDocument={saveDocuemnt}
        publishDocument={publishDocument}
        showUrl={showUrl}
        setShowUrl={setShowUrl}
        loading={loading}
      />
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
            ref={editorContainerRef}
          >
            {isLinkEditing && (
              <div
                className="absolute z-[4] bg-white border border-gray-300 shadow-md 
             p-[10px_5px] flex items-start pl-[10px] pb-[3px] gap-[3px]"
                style={{
                  top: `${linkMenuPosition.top}px`,
                  left: `${linkMenuPosition.left}px`,
                }}
              >
                <a
                  href={editor.getAttributes("link").href}
                  target="_blank"
                  className="text-black text-[14px] max-w-[150px] whitespace-nowrap 
               overflow-hidden text-ellipsis pt-[2px] pr-[5px] border-r border-gray-300"
                >
                  {editor.getAttributes("link").href}
                </a>
                <button
                  className="bg-transparent text-[18px] border-none cursor-pointer"
                  onClick={() => setShowUrl(true)}
                >
                  <PencilSimple />
                </button>
                <button
                  onClick={unsetLink}
                  className="bg-transparent text-[18px] border-none cursor-pointer"
                >
                  <Trash />
                </button>
              </div>
            )}
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

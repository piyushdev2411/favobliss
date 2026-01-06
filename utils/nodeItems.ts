import {
  TextB,
  ArrowUDownLeft,
  ArrowUDownRight,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  CodeSimple,
  TextHOne,
  TextHTwo,
  Highlighter,
  ListDashes,
  ListNumbers,
  Paragraph,
  Palette,
  TextAlignLeft,
  TextAlignRight,
  TextAlignCenter,
  TextAlignJustify,
  Image,
  TextH,
  TextHThree,
  TextHFour,
  TextHFive,
  Link,
  Table,
  ListChecks,
  CodeBlock,
  TextSubscript,
  TextSuperscript,
  Minus,
  Clipboard,
  Copy,
  Trash,
} from "@phosphor-icons/react";
// import  FormatIcon from "../assets/svg/format.svg";
// import  FormatSmall  from "../assets/svg/format-small.svg";
import { FaRemoveFormat } from "react-icons/fa";

import { NodeItems } from "@/types";
import { toast } from "sonner";

export const nodeItems: NodeItems[] = [
  {
    command: (editor) => editor.chain().focus().undo().run(),
    label: "Undo",
    icon: ArrowUDownLeft,
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().redo().run(),
    label: "Redo",
    icon: ArrowUDownRight,
    isFloatingMenu: false,
  },
  {
    command: (editor) =>
      editor.chain().focus().clearNodes().unsetAllMarks().run(),
    label: "Clear Formatting",
    icon: FaRemoveFormat,
    isFloatingMenu: false,
  },
  {
    label: "Font Type",
  },
  {
    label: "Font Size",
    isFloatingMenu: false,
  },
  {
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    label: "Format",
    icon: TextH,
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
    isFloatingMenu: true,
    isDropdown: true,
    dropdownItems: [
      {
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
        label: "Heading 1",
        icon: TextHOne,
        isActive: (editor) => editor.isActive("heading", { level: 1 }),
      },
      {
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
        label: "Heading 2",
        icon: TextHTwo,
        isActive: (editor) => editor.isActive("heading", { level: 2 }),
      },
      {
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
        label: "Heading 3",
        icon: TextHThree,
        isActive: (editor) => editor.isActive("heading", { level: 3 }),
      },
      {
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 4 }).run(),
        label: "Heading 4",
        icon: TextHFour,
        isActive: (editor) => editor.isActive("heading", { level: 4 }),
      },
      {
        command: (editor) =>
          editor.chain().focus().toggleHeading({ level: 5 }).run(),
        label: "Heading 5",
        icon: TextHFive,
        isActive: (editor) => editor.isActive("heading", { level: 5 }),
      },
    ],
  },
  {
    command: (editor) => editor.chain().focus().setParagraph().run(),
    label: "Paragraph",
    icon: Paragraph,
  },
  {
    command: (editor) => editor.chain().focus().toggleBold().run(),
    label: "Bold",
    icon: TextB,
    isActive: (editor) => editor.isActive("bold"),
    isFloatingMenu: true,
  },
  {
    command: (editor) => editor.chain().focus().toggleItalic().run(),
    label: "Italic",
    icon: TextItalic,
    isActive: (editor) => editor.isActive("italic"),
    isFloatingMenu: true,
  },
  {
    command: (editor) => editor.chain().focus().toggleUnderline().run(),
    label: "Underline",
    icon: TextUnderline,
    isActive: (editor) => editor.isActive("underline"),
    isFloatingMenu: true,
  },
  {
    command: (editor) => editor.chain().focus().toggleStrike().run(),
    label: "Strikethrough",
    icon: TextStrikethrough,
    isActive: (editor) => editor.isActive("strike"),
    isFloatingMenu: true,
  },
  {
    label: "Link",
    icon: Link,
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().toggleCode().run(),
    label: "Code",
    icon: CodeSimple,
    isActive: (editor) => editor.isActive("code"),
    isFloatingMenu: true,
  },
  // {
  //   command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  //   label: "Code Block",
  //   icon: CodeBlock,
  //   isActive: (editor) => editor.isActive("codeBlock"),
  //   isFloatingMenu: true,
  // },
  {
    command: (editor) => editor.chain().focus().toggleSubscript().run(),
    label: "Subscript",
    icon: TextSubscript,
    isActive: (editor) => editor.isActive("subscript"),
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().toggleSuperscript().run(),
    label: "Superscript",
    icon: TextSuperscript,
    isActive: (editor) => editor.isActive("superscript"),
    isFloatingMenu: false,
  },
  {
    command: (editor) =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
    label: "Table",
    icon: Table,
    isFloatingMenu: false,
  },
  {
    command: (editor) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload-image", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.status}`);
            }

            const { url } = await response.json();
            editor.chain().focus().setImage({ src: url }).run();
          } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Failed to upload image. Please try again.");
            // Optional fallback: insert as base64
            // const reader = new FileReader();
            // reader.onload = () => {
            //   if (reader.result) {
            //     editor.chain().focus().setImage({ src: reader.result as string }).run();
            //   }
            // };
            // reader.readAsDataURL(file);
          }
        }
      };
      input.click();
    },
    label: "Insert Image",
    icon: Image,
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
    label: "Horizontal Rule ",
    icon: Minus,
    isFloatingMenu: false,
  },
  {
    label: "Color Picker",
    icon: Palette,
    isColorPicker: true,
    isFloatingMenu: true,
  },
  {
    label: "Highlight Color",
    icon: Highlighter,
    isFloatingMenu: true,
  },
  {
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
    label: "Bullet List",
    icon: ListDashes,
    isActive: (editor) => editor.isActive("bulletList"),
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    label: "Ordered List",
    icon: ListNumbers,
    isActive: (editor) => editor.isActive("orderedList"),
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().toggleTaskList().run(),
    label: "Todo List",
    icon: ListChecks,
    isActive: (editor) => editor.isActive("taskList"),
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().setTextAlign("left").run(),
    label: "Align Left",
    icon: TextAlignLeft,
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().setTextAlign("center").run(),
    label: "Align Center",
    icon: TextAlignCenter,
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().setTextAlign("right").run(),
    label: "Align Right",
    icon: TextAlignRight,
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().setTextAlign("justify").run(),
    label: "Align Justify",
    icon: TextAlignJustify,
    isFloatingMenu: false,
  },
];

export const formatMenuItems: NodeItems[] = [
  {
    command: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
    label: "Heading 1",
    icon: TextHOne,
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    command: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
    label: "Heading 2",
    icon: TextHTwo,
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    command: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
    label: "Heading 3",
    icon: TextHThree,
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
  },
  {
    command: (editor) => editor.chain().focus().setHeading({ level: 4 }).run(),
    label: "Heading 4",
    icon: TextHFour,
    isActive: (editor) => editor.isActive("heading", { level: 4 }),
  },
  {
    command: (editor) => editor.chain().focus().setHeading({ level: 5 }).run(),
    label: "Heading 5",
    icon: TextHFive,
    isActive: (editor) => editor.isActive("heading", { level: 5 }),
  },
  {
    command: (editor) => editor.chain().focus().setParagraph().run(),
    label: "Paragraph",
    icon: Paragraph,
    isActive: (editor) => editor.isActive("paragraph"),
  },
  {
    command: (editor) => editor.chain().focus().toggleCode().run(),
    label: "Code",
    icon: CodeSimple,
    isActive: (editor) => editor.isActive("code"),
    isFloatingMenu: true,
  },
  {
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    label: "Code Block",
    icon: CodeBlock,
    isActive: (editor) => editor.isActive("codeBlock"),
    isFloatingMenu: true,
  },
  {
    command: (editor) =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
    label: "Table",
    icon: Table,
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
    label: "Horizontal Rule ",
    icon: Minus,
    isFloatingMenu: false,
  },
  {
    command: (editor) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              editor
                .chain()
                .focus()
                .setImage({ src: reader.result as string })
                .run();
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
    label: "Insert Image",
    icon: Image,
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
    label: "Bullet List",
    icon: ListDashes,
    isActive: (editor) => editor.isActive("bulletList"),
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    label: "Ordered List",
    icon: ListNumbers,
    isActive: (editor) => editor.isActive("orderedList"),
    isFloatingMenu: false,
  },
  {
    command: (editor) => editor.chain().focus().toggleTaskList().run(),
    label: "Todo List",
    icon: ListChecks,
    isActive: (editor) => editor.isActive("taskList"),
    isFloatingMenu: false,
  },
];

export const actionButtonItems: NodeItems[] = [
  {
    label: "Clear Formatting",
    icon: FaRemoveFormat,
  },
  {
    label: "Copy to clipboard",
    icon: Clipboard,
  },
  {
    label: "Duplicate",
    icon: Copy,
  },
  {
    label: "Delete",
    icon: Trash,
  },
];

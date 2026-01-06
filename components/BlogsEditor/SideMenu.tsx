"use client";

import { Editor } from "@tiptap/react";
import { toast } from "sonner";
import useContentItemActions from "@/hooks/editor/useContentActionItem";
import { useData } from "@/hooks/editor/useData";
import React, { useEffect } from "react";
import { NodeItems } from "@/types";

interface Props {
  editor: Editor;
  menuItems: NodeItems[];
  isFormatMenu: boolean;
}

const SideMenu = ({ editor, menuItems, isFormatMenu }: Props) => {
  const data = useData();
  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos
  );

  useEffect(() => {
    const { from } = editor.state.selection;
    const selectedNode = editor.state.doc.nodeAt(from);

    if (selectedNode) {
      data.handleNodeChange({
        node: selectedNode,
        editor: editor,
        pos: from,
      });
    }
  }, [editor, data]);

  const handleClick = (node: NodeItems) => {
    if (isFormatMenu) {
      node.command?.(editor);
    } else {
      if (node.label === "Clear Formatting") {
        actions.resetTextFormatting();
      } else if (node.label === "Copy to clipboard") {
        actions.copyNodeToClipboard();
        toast.success("Copied to clipboard");
      } else if (node.label === "Duplicate") {
        actions.duplicateNode();
      } else if (node.label === "Delete") {
        actions.deleteNode();
      }
    }
  };

  return (
    <div className="absolute z-10 bg-white text-gray-800 min-w-[120px] p-3 flex flex-col gap-3 border border-gray-100 rounded-md max-h-[230px] overflow-y-auto shadow-lg">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-2.5 cursor-pointer"
          onClick={() => handleClick(item)}
        >
          <span className={item.label === "Clear Formatting" ? "text-gray-500" : ""}>
            {item.icon && React.createElement(item.icon, { className: "w-5 h-5" })}
          </span>
          <p className="m-0 text-xs">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default SideMenu;
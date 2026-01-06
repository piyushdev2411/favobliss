"use client";

import React from "react";
import { Editor } from "@tiptap/react";

interface NodeItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  command?: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
}

interface Props {
  items: NodeItem[];
  editor: Editor;
}

const Dropdown = ({ items, editor }: Props) => {
  return (
    <div className="absolute z-10 w-max bg-white border border-gray-200 rounded-md shadow-md">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            console.log("Clicked", item);
            item.command?.(editor)}}
          className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
            item.isActive?.(editor) ? "bg-gray-100" : ""
          }`}
        >
          {item.icon &&
            React.createElement(item.icon, { className: "w-5 h-5" })}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Dropdown;
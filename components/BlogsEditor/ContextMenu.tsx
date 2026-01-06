"use client";

import React from "react";
import {
  RowsPlusBottom,
  ColumnsPlusRight,
  Rows,
  Columns,
  Trash,
} from "@phosphor-icons/react";

interface Props {
  position: { x: number; y: number };
  visible: boolean;
  onAction: (action: string) => void;
}

interface MenuItem {
  action: string;
  icon: React.ReactNode;
  label: string;
}

const menuItems: MenuItem[] = [
  {
    action: "addRowAfter",
    icon: <RowsPlusBottom size={20} className="mr-2.5" />,
    label: "Add Row After",
  },
  {
    action: "addColumnAfter",
    icon: <ColumnsPlusRight size={20} className="mr-2.5" />,
    label: "Add Column After",
  },
  {
    action: "deleteRow",
    icon: <Rows size={20} className="mr-2.5" />,
    label: "Delete Row",
  },
  {
    action: "deleteColumn",
    icon: <Columns size={20} className="mr-2.5" />,
    label: "Delete Column",
  },
  {
    action: "deleteTable",
    icon: <Trash size={20} className="mr-2.5" />,
    label: "Delete Table",
  },
];

const ContextMenu = ({ position, visible, onAction }: Props) => {
  if (!visible) return null;

  return (
    <div
      className="absolute bg-white border border-gray-200 rounded-2xl shadow-lg z-50"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <ul className="list-none m-0 p-2">
        {menuItems.map(({ action, icon, label }) => (
          <li key={action}>
            <button
              onClick={() => onAction(action)}
              className="flex items-start w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {icon}
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
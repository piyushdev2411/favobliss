"use client";

import { Editor } from "@tiptap/react";
import { formatMenuItems, actionButtonItems } from "@/utils/nodeItems";
import { Plus, DotsSixVertical } from "@phosphor-icons/react";
import SideMenu from "./SideMenu";
import { useCallback, useRef } from "react";
import useClickOutside from "@/hooks/editor/useClickOutside";
import { useData } from "@/hooks/editor/useData";
import useContentItemActions from "@/hooks/editor/useContentActionItem";

interface Props {
  editor: Editor;
  buttonPosition: {
    top: number;
    clientY: number;
  };
  showFormatMenu: boolean;
  showActionMenu: boolean;
  setShowFormatMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setShowActionMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const BlockMenu = ({
  buttonPosition,
  editor,
  showActionMenu,
  showFormatMenu,
  setShowActionMenu,
  setShowFormatMenu,
}: Props) => {
  const formatDropDownMenu = useRef<HTMLDivElement | null>(null);
  const actionDropDownMenu = useRef<HTMLDivElement | null>(null);
  const data = useData();

  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos
  );

  useClickOutside(
    formatDropDownMenu,
    useCallback(() => {
      setShowFormatMenu(false);
    }, [setShowFormatMenu])
  );

  useClickOutside(
    actionDropDownMenu,
    useCallback(() => {
      setShowActionMenu(false);
    }, [setShowActionMenu])
  );

  return (
    <div
      className="flex items-center absolute p-2"
      style={{ top: `${buttonPosition.top}px`, left: "0px" }}
    >
      <button
        className="p-2 rounded-md border-none bg-transparent hover:bg-gray-200 text-xl cursor-pointer"
        onClick={() => setShowFormatMenu(!showFormatMenu)}
      >
        <Plus />
      </button>
      <div className="relative">
        {showFormatMenu && (
          <SideMenu
            editor={editor}
            isFormatMenu={true}
            menuItems={formatMenuItems}
          />
        )}
      </div>
      <button
        className="p-2 rounded-md border-none bg-transparent hover:bg-gray-200 text-xl cursor-pointer"
        onClick={() => {
          actions.handleAdd();
          setShowActionMenu(!showActionMenu);
        }}
      >
        <DotsSixVertical />
      </button>
      <div className="relative">
        {showActionMenu && (
          <SideMenu
            menuItems={actionButtonItems}
            editor={editor}
            isFormatMenu={false}
          />
        )}
      </div>
    </div>
  );
};

export default BlockMenu;
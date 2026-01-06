import { useState, useEffect, useRef } from "react";
import { Editor } from "@tiptap/react";

type Position = { x: number; y: number };

const useContextMenu = (editor: Editor | null) => {
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });

  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutsideMenu = () => setContextMenuVisible(false);

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenuVisible(false);
      }
    };

    window.addEventListener("click", handleClickOutsideMenu);
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("click", handleClickOutsideMenu);
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    const isTableElement =
      targetElement.closest("table") && editor?.isActive("table");

    if (isTableElement) {
      setMenuPosition({ x: event.clientX, y: event.clientY });
      setContextMenuVisible(true);
    } else {
      setContextMenuVisible(false);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const targetElement = event.target as HTMLElement;

    const isTableElement =
      targetElement.closest("table") && editor?.isActive("table");

    if (isTableElement) {
      longPressTimeoutRef.current = setTimeout(() => {
        setMenuPosition({
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        });
        setContextMenuVisible(true);
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  return {
    contextMenuVisible,
    menuPosition,
    handleContextMenu,
    handleTouchStart,
    handleTouchEnd,
    setContextMenuVisible,
  };
};

export default useContextMenu;

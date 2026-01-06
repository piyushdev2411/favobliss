"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@tiptap/react";
import ColorPicker from "./ColorPicker";
import Dropdown from "./Dropdown";
import useClickOutside from "@/hooks/editor/useClickOutside";
import FontChange from "./FontChange";
import useDebounce from "@/hooks/editor/useDebounce";
import FontSelector from "./FontSelector";
import Link from "./Link";
import useFontSize from "@/hooks/editor/useFontSize";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { nodeItems } from "@/utils/nodeItems";

interface Props {
  editor: Editor;
  isPopUpMenu?: boolean;
  showUrl?: boolean;
  setShowUrl?: React.Dispatch<React.SetStateAction<boolean>>;
}

const NodeItems = (props: Props) => {
  const { editor, isPopUpMenu = false, showUrl, setShowUrl } = props;
  const [fontSize, setFontSize] = useFontSize(editor, 16);
  const debouncedFontSize = useDebounce(fontSize, 100);
  const [showHightLight, setShowHighlight] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const headerColorContainer = useRef<HTMLDivElement | null>(null);
  const headerHightLightContainer = useRef<HTMLDivElement | null>(null);
  const dropDownContainer = useRef<HTMLDivElement | null>(null);
  const linkWrapper = useRef<HTMLDivElement | null>(null);

  const toggleColorPicker = () => {
    setShowColorPicker((prev) => !prev);
  };

  const toggleColorMaker = () => {
    setShowHighlight((prev) => !prev);
    setShowColorPicker(false);
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  useClickOutside(
    headerColorContainer,
    useCallback(() => {
      setShowColorPicker(false);
    }, [])
  );

  useClickOutside(
    dropDownContainer,
    useCallback(() => {
      setOpenDropdown(null);
    }, [])
  );

  useClickOutside(
    linkWrapper,
    useCallback(() => {
      setShowUrl?.(false);
    }, [setShowUrl])
  );

  useClickOutside(
    headerHightLightContainer,
    useCallback(() => {
      setShowHighlight(false);
    }, [])
  );

  useEffect(() => {
    if (debouncedFontSize) {
      const { from, to } = editor.state.selection;
      editor
        .chain()
        .focus()
        .setFontSize(`${debouncedFontSize}px`)
        .setTextSelection({ from, to })
        .run();
    }
  }, [debouncedFontSize, editor]);

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  return (
    <div
      className={`flex ${
        isPopUpMenu
          ? "flex-wrap gap-1 bg-white p-0 rounded-md shadow-lg"
          : "items-center p-2 flex-wrap gap-5 max-w-full"
      }`}
    >
      {nodeItems.map((item, index) => (
        <React.Fragment key={item.label}>
          {(() => {
            if (!item.isFloatingMenu && isPopUpMenu) {
              return null;
            }
            if (item.label === "Font Size") {
              return (
                <FontChange size={fontSize} handleSize={handleFontSizeChange} />
              );
            }
            if (item.label === "Font Type") {
              return <FontSelector editor={editor} />;
            }
            if (item.label === "Link") {
              return (
                <div className="relative">
                  <Tippy content={item.label} placement="top">
                    <button
                      onClick={() => setShowUrl?.(true)}
                      className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-sm transition-colors"
                    >
                      {React.createElement(item.icon, { className: "w-4 h-4" })}
                    </button>
                  </Tippy>
                  {showUrl && (
                    <div
                      ref={linkWrapper}
                      className="absolute z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-md"
                    >
                      <Link editor={editor} />
                    </div>
                  )}
                </div>
              );
            }

            if (item.isColorPicker || item.label === "Highlight Color") {
              const isPicker = item.isColorPicker;
              const toggleFunction = isPicker
                ? toggleColorPicker
                : toggleColorMaker;
              const showComponent = isPicker ? showColorPicker : showHightLight;
              const isHightLight = isPicker ? false : true;
              const showRef = isPicker
                ? headerColorContainer
                : headerHightLightContainer;

              return (
                <div className="relative">
                  <Tippy key={item.label} content={item.label} placement="top">
                    <button
                      onClick={toggleFunction}
                      className="py-2 px-3 bg-transparent border-0 cursor-pointer text-gray-600 hover:bg-gray-200 rounded-sm transition-colors"
                    >
                      {React.createElement(item.icon)}
                    </button>
                  </Tippy>
                  {showComponent && (
                    <div ref={showRef} className="absolute z-10">
                      <ColorPicker editor={editor} isHighlight={isHightLight} />
                    </div>
                  )}
                </div>
              );
            }

            if (item.isDropdown && item.dropdownItems) {
              return (
                <div className="relative">
                  <Tippy content={item.label} placement="top">
                    <button
                      onClick={() => handleDropdownToggle(item.label)}
                      className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-sm transition-colors"
                    >
                      {React.createElement(item.icon, { className: "w-4 h-4" })}
                    </button>
                  </Tippy>
                  {openDropdown === item.label && (
                    <div ref={dropDownContainer}>
                      <Dropdown items={item.dropdownItems} editor={editor} />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Tippy content={item.label} placement="top">
                <button
                  onClick={() => item.command?.(editor)}
                  className={`p-1.5 text-gray-600 hover:bg-gray-200 rounded-sm transition-colors ${
                    item.isActive?.(editor) ? "bg-gray-300" : ""
                  }`}
                >
                  {React.createElement(item.icon, { className: "w-4 h-4" })}
                </button>
              </Tippy>
            );
          })()}

          {!isPopUpMenu && [2, 3, 4, 15, 17, 20, 23].includes(index) && (
            <div className="w-px h-6 bg-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NodeItems;

"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import Image from "next/image";
import {
  DownloadSimple,
  FloppyDisk,
  WifiHigh,
  WifiSlash,
} from "@phosphor-icons/react";
import "tippy.js/dist/tippy.css";
import { useRouter } from "next/navigation";
import NodeItems from "./NodeItems";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface Props {
  editor: Editor;
  showUrl?: boolean;
  setShowUrl?: React.Dispatch<React.SetStateAction<boolean>>;
  saveDocument?: () => void;
  publishDocument?: () => void;
  loading?: boolean;
}

const Header = (props: Props) => {
  const { editor, showUrl, setShowUrl, saveDocument, publishDocument, loading } = props;

  return (
    <div className="sticky top-0 z-10 bg-white w-full">
      <div className="flex items-center justify-between gap-4 p-4 pb-2 max-w-full">
        <div className="flex items-center gap-2.5">
          <Image
            src="/assets/favicon-nobg.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-12 h-12 md:w-12 md:h-12"
          />
          <h1 className="text-black font-bold text-2xl">Favobliss</h1>
        </div>
        <div className="flex items-center gap-5 relative">
          <Button
            onClick={saveDocument}
            className="group flex items-center gap-2 px-6 py-2.5 text-gray-700 font-medium bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={loading}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Save</span>
          </Button>
          <Button
            onClick={publishDocument}
            className="group flex items-center gap-2 px-6 py-2.5 text-white font-medium bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            disabled={loading}
          >
            <span>Publish</span>
            <FloppyDisk
              weight="bold"
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
          </Button>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-[#00F1C2] via-[#17B5E2] to-[#2574EA] mt-2" />
      <NodeItems editor={editor} showUrl={showUrl} setShowUrl={setShowUrl} />
    </div>
  );
};
export default Header;

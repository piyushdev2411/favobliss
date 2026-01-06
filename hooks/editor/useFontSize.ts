import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";

const useFontSize = (editor: Editor, defaultFontSize: number = 16) => {
  const [fontSize, setFontSize] = useState<number>(defaultFontSize);

  useEffect(() => {
    const updateFontSize = () => {
      const attrs = editor.getAttributes("textStyle");
      if (attrs?.fontSize) {
        setFontSize(parseInt(attrs.fontSize, 10));
      } else {
        setFontSize(defaultFontSize);
      }
    };

    editor.on("selectionUpdate", updateFontSize);

    return () => {
      editor.off("selectionUpdate", updateFontSize);
    };
  }, [editor, defaultFontSize]);

  return [fontSize, setFontSize] as const;
};

export default useFontSize;

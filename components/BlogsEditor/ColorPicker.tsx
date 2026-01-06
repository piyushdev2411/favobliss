"use client";

import { useState } from "react";
import { SketchPicker } from "react-color";
import { Editor } from "@tiptap/react";

interface Props {
  editor: Editor;
  isHighlight?: boolean;
}

const ColorPicker = ({ editor, isHighlight = false }: Props) => {
  const [color, setColor] = useState<string>("#000000");
  const [highlight, setHighlight] = useState<string>("#000000");

  const handleChangeComplete = (color: { hex: string }) => {
    setColor(color.hex);
    editor.chain().focus().setMark("textStyle", { color: color.hex }).run();
  };

  const handleHighlight = (highlight: { hex: string }) => {
    setHighlight(highlight.hex);
    editor.chain().focus().toggleHighlight({ color: highlight.hex }).run();
  };

  return (
    <div className="absolute z-10">
      <SketchPicker
        color={isHighlight ? highlight : color}
        onChangeComplete={isHighlight ? handleHighlight : handleChangeComplete}
      />
    </div>
  );
};

export default ColorPicker;
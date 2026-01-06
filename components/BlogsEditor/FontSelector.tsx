"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import Select, { StylesConfig } from "react-select";

interface Props {
  editor: Editor;
}

const fonts = [
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Comic Sans", value: "Comic Sans MS, Comic Sans" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Cursive", value: "cursive" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Inter", value: "Inter" },
  { label: "Monospace", value: "monospace" },
  { label: "Oswald", value: "'Oswald', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
];

const FontSelector = ({ editor }: Props) => {
  const [selectedFont, setSelectedFont] = useState(fonts[0]);

  const handleChange = (
    selectedOption: { label: string; value: string } | null
  ) => {
    if (selectedOption) {
      setSelectedFont(selectedOption);
      editor.chain().focus().setFontFamily(selectedOption.value).run();
    }
  };

  const customStyles: StylesConfig<{ label: string; value: string }, false> = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      fontFamily: state.data.value,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: "14px",
      fontFamily: state.data.value,
    }),
    input: (provided) => ({
      ...provided,
      fontFamily: selectedFont.value,
    }),
    control: (provided) => ({
      ...provided,
      width: 150,
      borderRadius: "0.375rem",
      borderColor: "#E6E8EB",
    }),
  };

  return (
    <div className="w-[150px]">
      <Select
        value={selectedFont}
        onChange={handleChange}
        options={fonts}
        styles={customStyles}
      />
    </div>
  );
};

export default FontSelector;

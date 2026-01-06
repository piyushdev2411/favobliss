"use client";

import React, { useEffect, useState } from "react";

interface Props {
  size: number;
  handleSize: (size: number) => void;
}

const FontChange = ({ size, handleSize }: Props) => {
  const [inputValue, setInputValue] = useState(size.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newSize = parseInt(inputValue, 10);
      if (!isNaN(newSize)) {
        handleSize(newSize);
      }
    }
  };

  const handleIncrement = () => {
    handleSize(size + 1);
  };

  const handleDecrement = () => {
    handleSize(size - 1);
  };

  useEffect(() => {
    setInputValue(size.toString());
  }, [size]);

  return (
    <div className="flex items-center gap-2 mb-1">
      <button
        onClick={handleDecrement}
        className="flex items-center justify-center w-6 h-6 text-xl bg-transparent border-none cursor-pointer hover:bg-gray-200 rounded"
      >
        -
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyPress}
        className="w-10 h-6 text-center text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={handleIncrement}
        className="flex items-center justify-center w-6 h-6 text-xl bg-transparent border-none cursor-pointer hover:bg-gray-200 rounded"
      >
        +
      </button>
    </div>
  );
};

export default FontChange;

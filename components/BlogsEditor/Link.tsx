import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

interface Props {
  editor: Editor;
}
const Link = (props: Props) => {
  const { editor } = props;
  const [url, setUrl] = useState<string>("");

  const handleSubmit = () => {
    if (url?.length <= 0) {
      return;
    }
    if (editor.isActive("link")) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } else {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
  };

  useEffect(() => {
    setUrl(editor.getAttributes("link").href);
  }, [editor]);

  return (
    <div>
      <div className="flex items-center gap-[10px] max-md:flex-col max-md:gap-[10px]">
        <input
          type="text"
          value={url}
          placeholder="Enter a URL"
          onChange={(e) => setUrl(e.target.value)}
          className="rounded-[5px] border border-[#E6E8EB] max-h-[77px] pl-2 h-8 w-[200px] max-[480px]:text-sm"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="border-none text-white cursor-pointer px-[10px] rounded-[4px] text-[12px] max-w-[193px] h-[35px] w-[80px] bg-[#504EF3] max-md:w-full max-md:max-w-none max-[480px]:w-full"
        >
          Set Link
        </button>
      </div>
    </div>
  );
};

export default Link;

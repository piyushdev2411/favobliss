"use client";

import { Editor } from "@tiptap/react";
import NodeItems from "./NodeItems";
import { BubbleMenu } from "@tiptap/react/menus";

interface Props {
  editor: Editor;
}

const Menu = ({ editor }: Props) => {
  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8, flip: true }}
    >
      <NodeItems editor={editor} isPopUpMenu={true} />
    </BubbleMenu>
  );
};

export default Menu;

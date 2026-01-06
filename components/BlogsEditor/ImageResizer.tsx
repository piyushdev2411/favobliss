import {
  NodeViewWrapper,
  type NodeViewProps,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import {
  CSSProperties,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import TipTapImage, { type ImageOptions } from "@tiptap/extension-image";
import { Editor, type NodeType } from "@tiptap/core";
import useClickOutSide from "@/hooks/editor/useClickOutside";

interface NodeAddAttributesThis {
  name: string;
  options: ImageOptions;
  storage: any;
  editor?: Editor;
  type: NodeType;
  parent?: () => { [key: string]: any };
}

const useEvent = <T extends (...args: any[]) => any>(handler: T): T => {
  const handlerRef = useRef<T | null>(null);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  return useCallback((...args: Parameters<T>): ReturnType<T> => {
    if (handlerRef.current === null) {
      throw new Error("Handler is not assigned");
    }
    return handlerRef.current(...args);
  }, []) as T;
};

const MIN_WIDTH = 60;
const BORDER_COLOR = "#0096fd";

const ResizableImageTemplate = ({ node, updateAttributes }: NodeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [editing, setEditing] = useState(false);
  const [resizingStyle, setResizingStyle] = useState<
    Pick<CSSProperties, "width"> | undefined
  >();

  useClickOutSide(
    containerRef,
    useCallback(() => {
      setEditing(false);
    }, [setEditing])
  );

  const handleMouseDown = useEvent(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!imgRef.current) return;
      event.preventDefault();
      const direction = event.currentTarget.dataset.direction || "--";
      const initialXPosition = event.clientX;
      const currentWidth = imgRef.current.width;
      let newWidth = currentWidth;
      const transform = direction[1] === "w" ? -1 : 1;

      const removeListeners = () => {
        window.removeEventListener("mousemove", mouseMoveHandler);
        window.removeEventListener("mouseup", removeListeners);
        updateAttributes({ width: newWidth });
        setResizingStyle(undefined);
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        newWidth = Math.max(
          currentWidth + transform * (event.clientX - initialXPosition),
          MIN_WIDTH
        );
        setResizingStyle({ width: newWidth });
        if (!event.buttons) removeListeners();
      };

      window.addEventListener("mousemove", mouseMoveHandler);
      window.addEventListener("mouseup", removeListeners);
    }
  );

  const handleTouchStart = useEvent(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!imgRef.current) return;
      event.preventDefault();
      const direction = event.currentTarget.dataset.direction || "--";
      const initialXPosition = event.touches[0].clientX;
      const currentWidth = imgRef.current.width;
      let newWidth = currentWidth;
      const transform = direction[1] === "w" ? -1 : 1;

      const removeListeners = () => {
        window.removeEventListener("touchmove", touchMoveHandler);
        window.removeEventListener("touchend", removeListeners);
        updateAttributes({ width: newWidth });
        setResizingStyle(undefined);
      };

      const touchMoveHandler = (event: TouchEvent) => {
        newWidth = Math.max(
          currentWidth +
            transform * (event.touches[0].clientX - initialXPosition),
          MIN_WIDTH
        );
        setResizingStyle({ width: newWidth });
      };

      window.addEventListener("touchmove", touchMoveHandler);
      window.addEventListener("touchend", removeListeners);
    }
  );

  const dragCornerButton = (direction: string) => {
    const isMobile = window.innerWidth <= 768;
    return (
      <div
        role="button"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        data-direction={direction}
        style={{
          position: "absolute",
          height: isMobile ? "20px" : "10px",
          width: isMobile ? "20px" : "10px",
          backgroundColor: BORDER_COLOR,
          ...{ n: { top: 0 }, s: { bottom: 0 } }[direction[0]],
          ...{ w: { left: 0 }, e: { right: 0 } }[direction[1]],
          cursor: `${direction}-resize`,
          zIndex: 10,
        }}
      ></div>
    );
  };

  return (
    <NodeViewWrapper
      ref={containerRef}
      as="div"
      draggable
      data-drag-handle
      onClick={() => setEditing(true)}
      onBlur={() => setEditing(false)}
      style={{
        overflow: "visible",
        position: "relative",
        display: "inline-block",
        lineHeight: "0px",
      }}
    >
      <img
        {...node.attrs}
        ref={imgRef}
        style={{
          ...resizingStyle,
          cursor: "default",
        }}
      />
      {editing && (
        <>
          {[
            { left: 0, top: 0, height: "100%", width: "1px" },
            { right: 0, top: 0, height: "100%", width: "1px" },
            { top: 0, left: 0, width: "100%", height: "1px" },
            { bottom: 0, left: 0, width: "100%", height: "1px" },
          ].map((style, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                backgroundColor: BORDER_COLOR,
                ...style,
              }}
            ></div>
          ))}
          {dragCornerButton("nw")}
          {dragCornerButton("ne")}
          {dragCornerButton("sw")}
          {dragCornerButton("se")}
        </>
      )}
    </NodeViewWrapper>
  );
};

const ResizableImageExtension = TipTapImage.extend({
  addAttributes(this: NodeAddAttributesThis) {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        renderHTML: (attributes:any) => {
          return { width: attributes.width || "auto" };
        },
        parseHTML: (element:any) => element.style.width || "auto",
      },
      height: {
        default: "auto",
        renderHTML: (attributes:any) => {
          return { height: attributes.height || "auto" };
        },
        parseHTML: (element:any) => element.style.height || "auto",
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageTemplate);
  },
}).configure({ inline: true });

export default ResizableImageExtension;
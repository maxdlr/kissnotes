export type BubblePosition = "top" | "bottom" | "left" | "right";

export type BubbleProps = {
  content: string;
  position?: BubblePosition;
};

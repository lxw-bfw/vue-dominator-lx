import { App, Directive } from "vue";

declare module "vue-dominator" {
  export const useObserveResize: (
    el: HTMLElement,
    callback: (cr: DOMRectReadOnly, resize: ResizeObserver) => void
  ) => void;

  export const dominator: (app: App) => void;

  export const directiveCollection: {
    [key: string]: Directive;
  };

  export type Direction = "left" | "right" | "up" | "down" | "middle";

  export interface DragOptions {
    position?: string;
    isLimitParent?: boolean;
    onDragStart?: (event: MouseEvent) => void;
    onDrag?: (event: MouseEvent) => void;
    onDragEnd?: (event: MouseEvent) => void;
    onBoundaryTouch?: (direction: Direction) => void;
  }
}

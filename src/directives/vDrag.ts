import { DirectiveBinding } from "vue";

export interface DragOptions {
  position?: string; // 绑定了拖动指令后的元素的定位模式：relative | absolute | fixed，如果元素自身设置了定位（非默认静态定位static）优先从元素自身获取，否则从拖动指令获取，默认值relative
  isLimitParent?: boolean; // 是否限制在提供的设置relative定位的父容器范围内，true|false，默认为true
  onDragStart?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent) => void;
  onDragEnd?: (event: MouseEvent) => void;
  onBoundaryTouch?: (direction: Direction) => void;
}

export type Direction = "left" | "right" | "up" | "down" | "middle";

type MouseFn = (event: MouseEvent) => void;

let onMouseDown: MouseFn;
let debounceMouseMove: MouseFn;
let onMouseUp: MouseFn;
let onMouseLeft: MouseFn;

// function debounce<T extends (...args: any[]) => void>(
//   func: T,
//   delay: number = 0
// ): (...args: Parameters<T>) => void {
//   let timeoutId: ReturnType<typeof setTimeout>;

//   return function (...args: Parameters<T>): void {
//     clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// }

const extractNumberFromString = (str: string) => {
  const regex = /-?\d+/;
  const matches = str.match(regex);
  return matches ? (parseInt(matches[0]) === 0 ? 1 : parseInt(matches[0])) : 0;
};

const mouseDirection = () => {
  let lastMouseX: number;
  let lastMouseY: number;

  return (
    cx: number,
    cy: number
  ): { directionX: Direction | ""; directionY: Direction | "" } => {
    let directionX: Direction | "" = "";
    let directionY: Direction | "" = "";

    if (lastMouseX || lastMouseX === 0) {
      directionX =
        cx === lastMouseX ? "middle" : cx > lastMouseX ? "right" : "left";
    }

    if (lastMouseY || lastMouseY === 0) {
      directionY =
        cy === lastMouseY ? "middle" : cy > lastMouseY ? "down" : "up";
    }

    lastMouseX = cx;
    lastMouseY = cy;

    return {
      directionX: directionX,
      directionY: directionY,
    };
  };
};

const vDrag = {
  drag: {
    mounted(el: HTMLElement, binding: DirectiveBinding<DragOptions>) {
      let {
        position = "relative",
        isLimitParent = true,
        onDragStart,
        onDrag,
        onDragEnd,
        onBoundaryTouch,
      } = binding.value || { position: "relative", isLimitParent: true };

      const computedStyle = window.getComputedStyle(el);
      const elPos = computedStyle.getPropertyValue("position");

      el.style.position = elPos && elPos !== "static" ? elPos : position;
      el.style.cursor = "grab";

      onMouseDown = (event: MouseEvent) => {
        const getMouseDirection = mouseDirection();
        let leftValue = extractNumberFromString(
          computedStyle.getPropertyValue("left")
        );
        let topValue = extractNumberFromString(
          computedStyle.getPropertyValue("top")
        );

        let startX = event.clientX;
        let startY = event.clientY;

        const onMouseMove = (event: MouseEvent) => {
          // 限制元素在网页内移动，不超出边界
          const mDir = getMouseDirection(event.clientX, event.clientY);
          const rect = el.getBoundingClientRect();
          // 开启相对父元素的拖动，否则都是相对于浏览器窗口进行移动，边界计算也是基于浏览器网页窗口边界
          const offsetParentRect = isLimitParent
            ? el.offsetParent?.getBoundingClientRect()
            : null;
          if (position === "relative") {
            const parentLeft = offsetParentRect ? offsetParentRect.left : 0;
            const parentTop = offsetParentRect ? offsetParentRect.top : 0;
            const parentWidth = offsetParentRect
              ? offsetParentRect.width
              : window.innerWidth;
            const parentHeight = offsetParentRect
              ? offsetParentRect.height
              : window.innerHeight;
            const moveCurLeft = rect.left - parentLeft;
            const moveCurRight = rect.right;
            const moveCurTop = rect.top - parentTop;
            const moveCurDown = rect.bottom;
            // let moveCurLeft = el.offsetLeft;

            if (
              moveCurLeft <= 0 &&
              (mDir.directionX === "left" || mDir.directionX === "middle")
            ) {
              startX = event.clientX;
              leftValue = extractNumberFromString(
                computedStyle.getPropertyValue("left")
              );
              onBoundaryTouch && onBoundaryTouch("left");
              return;
            }

            if (
              moveCurRight >= parentWidth &&
              (mDir.directionX === "right" || mDir.directionX === "middle")
            ) {
              startX = event.clientX;
              leftValue = extractNumberFromString(
                computedStyle.getPropertyValue("left")
              );
              onBoundaryTouch && onBoundaryTouch("right");
              return;
            }

            if (
              moveCurTop <= 0 &&
              (mDir.directionY === "up" || mDir.directionY === "middle")
            ) {
              startY = event.clientY;
              topValue = extractNumberFromString(
                computedStyle.getPropertyValue("top")
              );
              onBoundaryTouch && onBoundaryTouch("up");
              return;
            }

            if (
              moveCurDown >= parentHeight &&
              (mDir.directionY === "down" || mDir.directionY === "middle")
            ) {
              startY = event.clientY;
              topValue = extractNumberFromString(
                computedStyle.getPropertyValue("top")
              );
              onBoundaryTouch && onBoundaryTouch("down");
              return;
            }
          } else if (position === "absolute" || position === "fixed") {
            const oLeft = el.offsetLeft;
            const oTop = el.offsetTop;
            const eleWidth = el.offsetWidth;
            const eleHeight = el.offsetHeight;
            const parentWidth = offsetParentRect
              ? offsetParentRect.width
              : window.innerWidth;
            const parentHeight = offsetParentRect
              ? offsetParentRect.height
              : window.innerHeight;

            if (oLeft <= 0 && isLimitParent) {
              el.style.left = "0px";
            }
            if (
              oLeft <= 0 &&
              isLimitParent &&
              (mDir.directionX === "left" || mDir.directionX === "middle")
            ) {
              startX = event.clientX;
              leftValue = extractNumberFromString(
                computedStyle.getPropertyValue("left")
              );
              onBoundaryTouch && onBoundaryTouch("left");
              return;
            }
            if (
              oTop <= 0 &&
              isLimitParent &&
              (mDir.directionY === "up" || mDir.directionY === "middle")
            ) {
              startY = event.clientY;
              topValue = extractNumberFromString(
                computedStyle.getPropertyValue("top")
              );
              onBoundaryTouch && onBoundaryTouch("up");
              return;
            }
            if (eleWidth + oLeft >= parentWidth) {
              el.style.left = parentWidth - eleWidth + "px";
            }
            if (
              eleWidth + oLeft >= parentWidth &&
              (mDir.directionX === "right" || mDir.directionX === "middle")
            ) {
              startX = event.clientX;
              leftValue = extractNumberFromString(
                computedStyle.getPropertyValue("left")
              );
              onBoundaryTouch && onBoundaryTouch("right");
              return;
            }

            if (
              eleHeight + oTop >= parentHeight &&
              (mDir.directionY === "down" || mDir.directionY === "middle")
            ) {
              startY = event.clientY;
              topValue = extractNumberFromString(
                computedStyle.getPropertyValue("top")
              );
              onBoundaryTouch && onBoundaryTouch("down");
              return;
            }
          }

          const dx =
            position === "relative"
              ? `${event.clientX - startX + leftValue}px`
              : `${event.clientX - startX + leftValue}px`;
          const dy =
            position === "relative"
              ? `${event.clientY - startY + topValue}px`
              : `${event.clientY - startY + topValue}px`;

          el.style.left = dx;
          el.style.top = dy;
          el.style.cursor = "grabbing";

          onDrag && onDrag(event);
        };
        debounceMouseMove = (event: MouseEvent) => {
          requestAnimationFrame(() => {
            onMouseMove(event);
          });
        };
        onDragStart && onDragStart(event);
        window.addEventListener("mousemove", debounceMouseMove);
      };

      onMouseUp = (event: MouseEvent) => {
        el.style.cursor = "grab";
        window.removeEventListener("mousemove", debounceMouseMove);

        onDragEnd && onDragEnd(event);
      };
      onMouseLeft = (event: MouseEvent) => {
        window.removeEventListener("mousemove", debounceMouseMove);
        onDragEnd && onDragEnd(event);
      };

      el.addEventListener("mousedown", onMouseDown);
      el.addEventListener("mouseup", onMouseUp);
      el.addEventListener("mouseleave", onMouseLeft);
    },
    //绑定元素的父组件卸载后将相关事件进行清除
    unmounted(el: HTMLElement) {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeft);
    },
  },
};

export default vDrag;

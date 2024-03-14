import { mount } from "@vue/test-utils";
import { describe, expect, test } from "vitest";
import DragBox from "../../examples/components/DragBox.vue";
import vDrag from "../../src/directives/vDrag";

describe("v-drag directive", () => {
  test("element bound to v-drag can follow the mouse", async () => {
    const wrapper = mount(DragBox, {
      global: {
        directives: {
          drag: vDrag.drag,
        },
      },
    });
    const dragElement = wrapper.find("#drap-item");
    document.body.appendChild(dragElement.element);
    (dragElement.element as HTMLElement).offsetWidth;

    const drageEleComputedStyle = getComputedStyle(dragElement.element);
    const originLeft = drageEleComputedStyle.left;
    const originTop = drageEleComputedStyle.top;

    await dragElement.trigger("mousedown", { clientX: 375, clientY: 508 });
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 420, clientY: 621 })
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await dragElement.trigger("mouseup", { clientX: 420, clientY: 621 });

    expect(drageEleComputedStyle.left).not.toBe(originLeft);
    expect(drageEleComputedStyle.top).not.toBe(originTop);
  });

  test("follow the mouse movement correctly", async () => {
    const wrapper = mount(DragBox, {
      global: {
        directives: {
          drag: vDrag.drag,
        },
      },
    });
    const dragElement = wrapper.find("#drap-item");
    document.body.appendChild(dragElement.element);

    (dragElement.element as HTMLElement).offsetWidth;

    const drageEleComputedStyle = getComputedStyle(dragElement.element);
    let left = drageEleComputedStyle.left;
    let top = drageEleComputedStyle.top;

    await dragElement.trigger("mousedown", { clientX: 375, clientY: 508 });
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 420, clientY: 621 })
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await dragElement.trigger("mouseup", { clientX: 420, clientY: 621 });

    left = drageEleComputedStyle.left;
    top = drageEleComputedStyle.top;

    await dragElement.trigger("mousedown", { clientX: 420, clientY: 621 });
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 430, clientY: 631 })
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await dragElement.trigger("mouseup", { clientX: 430, clientY: 631 });
    expect(parseFloat(left) + 10).toBe(parseFloat(drageEleComputedStyle.left));
    expect(parseFloat(top) + 10).toBe(parseFloat(drageEleComputedStyle.top));
  });
});

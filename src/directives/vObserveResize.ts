import { DirectiveBinding } from "vue";
import useObserveResize from "../hooks/useObserveResize";

const vObserveResize = {
  "observe-resize": {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      useObserveResize(el, binding.value);
    },
  },
};
export default vObserveResize;

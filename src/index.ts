import type { App } from "vue";

import { useObserveResize } from "./hooks";
import directiveCollection from "./directives";

const install = (app: App) => {
  Object.entries(directiveCollection).forEach(([name, directive]) => {
    if (import.meta.env.DEV) {
      console.log("正在注册指令:", name);
    }
    app.directive(name, directive);
  });
};

// hooks导出
export { useObserveResize };

// vue插件导出
export { install as dominator };

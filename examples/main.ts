import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { dominator } from "../src/index";

createApp(App).use(dominator).mount("#app");

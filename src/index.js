import { createApp, render, createVNode } from "vue";
import "./style.css";
import "@inagora/wd-view/dist/index.css";
import ProTable from "./ProTable.vue";

export function init(config) {
  let el = config.el;
  if (!el) {
    console.error("The container can not be null");
    return;
  }
  if (typeof el === "string") {
    el = document.querySelector(el);
  } else if (el.length) {
    el = el[0];
  }

  if (!(el instanceof HTMLElement)) {
    console.error("The container is not a dom, please check!");
    return null;
  }
  let app = createApp({
    data() {
      return config;
    },
  });
  app.mount(el);
  const vnode = createVNode(ProTable, { config });
  render(vnode, el);
  return app;
}

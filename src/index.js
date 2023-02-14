import ProTable from "./protable";

const components = [ProTable];
const install = (app) => {
  // 是否需要加载icon css
  components.forEach((component) => {
    app.component(component.name, component);
  });
  app.config.warnHandler = () => null;
};
export { ProTable };
export default {
  install,
};

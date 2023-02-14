import { createApp } from "vue";
import App from "./App.vue";
import ProTable from "./protable/ProTable.vue";

const app = createApp(App);
app.component("pro-table", ProTable);
app.config.warnHandler = () => null;
app.mount("#app");

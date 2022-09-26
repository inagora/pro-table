<script setup>
import { provide, onUnmounted } from "vue";
import mitt from "mitt";
const emitter = mitt();
import Table from "./components/Table.vue";
import Toolbar from "./components/Toolbar.vue";
import Search from "./components/Search.vue";
import Title from "./components/Title.vue";
import Tips from "./components/Tips.vue";
// 支持的组件
const components = [Title, Tips, Toolbar, Search, Table];
const props = defineProps(["config"]);
const config = props.config;
const conf = Object.assign(
  {
    /**
     * 页面顶部标题
     */
    title: "",
    /**
     * 自定义的页面部分
     */
    tips: "",
    /**
     * 表格列配置
     */
    columns: [],
    /**
     * @param {String} pageMode 分页模式。普通模式(normal)把所有数据分成等分的多少页，按页号取每页数据；瀑布流模式(waterfall)，根据当前页的第一项，向前取一页；或最后一项，向后取一页
     */
    pageMode: "normal", // normal | waterfall
    /**
     * 静态列表数据，如果设置了则不发请求
     */
    records: false,
    /**
     * 搜索区域配置
     */
    searchFilters: [],
    /**
     * 操作区
     */
    toolbar: false,
    /**
     * 列表选择模式：radio、checkbox
     */
    selectMode: "checkbox",
    /**
     * 表单是否显示label
     */
    labelVisible: true,
    /**
     * 列表请求url
     */
    url: "",
    /**
     * 添加url
     */
    addUrl: "",
    /**
     * 添加conf
     */
    addConf: "",
    /**
     * 删除url
     */
    deleteUrl: "",
    /**
     * 更新url
     */
    updateUrl: "",
    /**
     * 编辑conf
     */
    editConf: "",
    /**
     * 是否自动显示导出按钮
     */
    downloadable: false,
    /**
     * 进入页面是否自动发送请求
     */
    autoRequest: true,
    /**
     * 列头自适应宽度
     */
    autoWidth: false,
    /**
     * ajax请求method
     */
    method: "GET",
    /**
     * ajax请求配置
     */
    ajaxSetting: {},
    /**
     * 搜索区域后面的按钮
     */
    searchAreaBtns: false,
    /**
     * 搜索区域是否可重置
     */
    resetable: false,
    /**
     * 事件监听
     */
    listeners: {},
    /**
     * 操作需要的主键
     */
    idIndex: "id",
  },
  config
);
provide("config", conf);
provide("emitter", emitter);
emitter.on("*", (type, e) => {
  if (config.listeners && config.listeners[type]) {
    return config.listeners[type](e);
  }
});
onUnmounted(() => {
  emitter.all.clear();
});
</script>

<template>
  <div ref="wvProTable" class="wv-pro-table">
    <template v-for="(com, index) in components" :key="index">
      <component :is="com"></component>
    </template>
  </div>
</template>
<style scoped>
.wv-pro-table {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>

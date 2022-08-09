<script setup>
import { provide } from "vue";
import Table from "./components/Table.vue";
import Toolbar from "./components/Toolbar.vue";
import Search from "./components/Search.vue";
import Title from "./components/Title.vue";
// 支持的组件
const components = [Title, Toolbar, Search, Table];
const props = defineProps(["config"]);
const config = props.config;
provide("config", config);
</script>

<template>
  <div class="wv-pro-table">
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

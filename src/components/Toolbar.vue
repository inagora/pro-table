<script setup>
import { inject, onMounted, ref } from "vue";
import { WdButton } from "@inagora/wd-view";
import { loadJs } from "../utils/util.js";

const config = inject("config");
const emitter = inject("emitter");
// 下载，设置了downloadable，创建两个按钮
const toolbarBtns = ref([]);
onMounted(() => {
  if (config.downloadable) {
    loadJs(
      "https://oss.wandougongzhu.cn/lib/exceljs/4.2.1/dist/exceljs.min.js"
    );
  }
  toolbarBtns.value = config.toolbar || [];
  if (config.downloadable && config.downloadable === "single") {
    // 导出当前页
    toolbarBtns.value.unshift(
      ...[
        {
          type: "primary",
          text: "导出当前页",
          click() {},
        },
        "|",
      ]
    );
  } else if (config.downloadable) {
    toolbarBtns.value.unshift(
      ...[
        {
          type: "primary",
          text: "导出全部",
          click() {
            emitter.emit("downloadAll");
          },
        },
        {
          type: "primary",
          text: "导出当前页",
          click() {
            emitter.emit("download");
          },
        },
        "|",
      ]
    );
  }
  // upload按钮，仅支持xlsx或者csv，自动解析出json数据
});
// 新增
</script>

<template>
  <div class="wv-toolbar">
    <template v-for="(button, index) in toolbarBtns" :key="index">
      <div v-if="button === '|'" class="wv-toolbar-separator">&nbsp;</div>
      <wd-button
        v-else
        @click="button.click"
        :type="button.type"
        :icon="button.icon"
        :loading="button.loading"
        :size="button.size"
        >{{ button.text }}</wd-button
      >
    </template>
  </div>
</template>

<style scoped>
.wv-toolbar {
  border-bottom: 1px solid #d0d0d0;
  padding: 6px 0 0 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.wd-btn {
  margin-right: 8px;
  margin-bottom: 10px;
}
</style>

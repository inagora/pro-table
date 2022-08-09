<script setup>
import { inject } from "vue";
import { WdButton } from "@inagora/wd-view";
const config = inject("config");
// 下载
// 新增
</script>

<template>
  <div class="wv-toolbar">
    <template v-for="(button, index) in config.toolbar" :key="index">
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

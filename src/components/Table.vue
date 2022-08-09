<script setup>
import { inject } from "vue";
import { WdTable, WdButtonGroup, WdButton } from "@inagora/wd-view";
const config = inject("config");
// 编辑、删除
</script>

<template>
  <div class="wv-table">
    <wd-table
      ref="wdTable"
      :columns="config.columns"
      :data-source="config.records"
      text="数据加载中"
      empty-text="现在还没有数据噢~"
    >
      <template v-slot:custom="slotScope">
        <template v-if="slotScope.column.dataIndex === 'action'">
          <wd-button-group>
            <wd-button
              v-for="(button, index) in slotScope.column.buttons"
              :ke="index"
              :size="button.size"
              :type="button.type"
              @click="button.click"
              >{{ button.text }}</wd-button
            >
          </wd-button-group>
        </template>
      </template>
    </wd-table>
  </div>
</template>
<style scoped>
.wv-table {
  flex: 1;
  width: 100%;
  overflow-y: scroll;
}
</style>

<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
import { WdTable, WdButtonGroup, WdButton } from "@inagora/wd-view";
import Ajax from "../utils/Ajax.js";

const config = inject("config");
// 编辑、删除
let allFixedRightEls;
let allFixedLeftEls;
onMounted(() => {
  load();
  document
    .querySelector(".wv-table")
    .addEventListener("scroll", scrollListener);
});
onUnmounted(() => {
  document
    .querySelector(".wv-table")
    .removeEventListener("scroll", scrollListener);
});
const scrollListener = (e) => {
  if (!allFixedRightEls) {
    allFixedRightEls = document.querySelectorAll(".wd-table-fixed-right");
    allFixedLeftEls = document.querySelectorAll(".wd-table-fixed-left");
  }
  let scrollLeft = e.target.scrollLeft;
  if (scrollLeft === 0) {
    // 滚动到最左边
    setFixedStyle("left", "remove");
  } else {
    setFixedStyle("left", "add");
  }
  if (scrollLeft + e.target.clientWidth === e.target.scrollWidth) {
    setFixedStyle("right", "remove");
  } else {
    setFixedStyle("right", "add");
  }
};
// 设置滚动时fixed样式
const setFixedStyle = (direction, method) => {
  if (direction === "left") {
    allFixedLeftEls.forEach((el) => {
      if (method === "remove") {
        el.classList.remove("wd-table-fixed-left-first");
      } else {
        el.classList.add("wd-table-fixed-left-first");
      }
    });
  } else {
    allFixedRightEls.forEach((el) => {
      if (method === "remove") {
        el.classList.remove("wd-table-fixed-right-first");
      } else {
        el.classList.add("wd-table-fixed-right-first");
      }
    });
  }
};
// 请求数据
const records = ref([]);
const loading = ref(false);
const ajax = new Ajax(config.ajaxSetting);
const load = () => {
  loading.value = true;
  if (config.records) {
    records.value = config.records;
    return;
  }
  ajax
    .request({
      url: config.url,
    })
    .then((res) => {
      loading.value = false;
      if (res && res.data.list) {
        records.value = res.data.list;
      }
    });
};
</script>

<template>
  <div class="wv-table">
    <wd-loading :loading="loading">
      <wd-table
        ref="wdTable"
        :columns="config.columns"
        :data-source="records"
        text="数据加载中"
        empty-text="现在还没有数据噢~"
        @change="load"
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
                >{{ button.text }}
              </wd-button>
            </wd-button-group>
          </template>
        </template>
      </wd-table>
    </wd-loading>
  </div>
</template>
<style scoped>
.wv-table {
  flex: 1;
  width: 100%;
  overflow-y: scroll;
}
</style>

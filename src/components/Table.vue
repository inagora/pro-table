<script setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
import {
  WdTable,
  WdButtonGroup,
  WdButton,
  WdDialog,
  WdMessage,
  WdModal,
  WdLoading,
} from "@inagora/wd-view";
import WvForm from "./Form.vue";
import Ajax from "../utils/Ajax.js";
import download from "../utils/Download.js";
import { isObject } from "../utils/util.js";

const config = inject("config");
// 如果设置了updateUrl,但是没有设置editConf,则使用addConf
if (config.updateUrl && !config.editConf) {
  config.editConf = config.addConf;
}
// 表头自适应宽度
const flexColumnWidth = (str) => {
  let flexWidth = 0;
  for (const char of str) {
    if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
      // 如果是英文字符，为字符分配8个单位宽度
      flexWidth += 8;
    } else if (char >= "\u4e00" && char <= "\u9fa5") {
      // 如果是中文字符，为字符分配18个单位宽度
      flexWidth += 18;
    } else {
      // 其他种类字符，为字符分配8个单位宽度
      flexWidth += 8;
    }
  }
  if (flexWidth < 100) {
    // 设置最小宽度
    flexWidth = 100;
  }
  return flexWidth;
};
if (config.autoWidth) {
  config.columns.forEach((column) => {
    column.width = flexColumnWidth(column.title);
  });
}

const emitter = inject("emitter");
emitter.on("wv:download", () => {
  download(config.columns, records.value);
});
const exportPage = ref(1);
const exporting = ref(false);
emitter.on("wv:downloadAll", async () => {
  let allData = [];
  exporting.value = true;
  for (let i = 0; i < pageCount.value; i++) {
    exportPage.value = i + 1;
    const pageData = await load(i + 1);
    allData = allData.concat(pageData);
  }
  exporting.value = false;
  download(config.columns, allData);
});
// 搜索事件
let searchParams = {};
emitter.on("wv:search", (params) => {
  searchParams = params;
  page = 1;
  load();
});
const opType = ref("add");
// 新增一项
const formData = ref({});
const isShowAddDialog = ref(false);
emitter.on("wv:add", () => {
  opType.value = "add";
  config.addConf.forEach((item) => {
    formData.value[item.prop] = item.value || "";
  });
  isShowAddDialog.value = true;
});
// 保存
const saveHandler = () => {
  saveRequest(config.addUrl);
};
const saveRequest = (url) => {
  ajax
    .request({
      url,
      method: "POST",
      data: formData.value,
    })
    .then((res) => {
      if (res && res.code) {
        page = 1;
        load();
      } else {
        WdMessage({
          message: "保存失败",
          type: "error",
        });
      }
      emitter.emit(opType.value, res);
    });
};
// 编辑
const editHandler = () => {
  opType.value = "edit";
  config.editConf.forEach((item) => {
    formData.value[item.prop] = item.value || "";
  });
  isShowAddDialog.value = true;
};
// 删除
const deleteHandler = (row) => {
  WdModal.confirm({
    title: "提示",
    type: "danger",
    content: "确定要删除吗？",
    destroyOnClose: true,
    onConfirm() {
      ajax
        .request({
          url: config.deleteUrl,
          method: "POST",
          data: {
            [config.idIndex]: row[config.idIndex],
          },
        })
        .then((res) => {
          if (res && res.code) {
            page = 1;
            load();
            this.destroy();
          } else {
            WdMessage({
              message: "删除失败",
              type: "error",
            });
          }
          emitter.emit("wv:delete", res);
        });
    },
  });
};
let allFixedRightEls;
let allFixedLeftEls;
onMounted(() => {
  if (config.autoRequest) {
    load();
  }
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
const pageCount = ref(1);
let page = 1;
const ajax = new Ajax(config.ajaxSetting);
const load = (currentPage) => {
  // let searchParams = {
  //   page: currentPage || page,
  // };
  searchParams.page = currentPage || page;
  // emit返回值接收不到，有问题待解决
  // if (!currentPage) {
  //   let result = emitter.emit("beforeDataRequest", searchParams);
  //   if (!result) return;
  //   if (isObject(result)) {
  //     searchParams = Object.assign({}, searchParams, result);
  //   }
  // }
  loading.value = true;
  if (config.records) {
    records.value = config.records;
    return;
  }
  return new Promise((resolve, reject) => {
    ajax
      .request({
        url: config.url,
        data: searchParams,
      })
      .then((res) => {
        loading.value = false;
        if (res && res.data.list) {
          records.value = res.data.list;
          pageCount.value = res.data.page_count;
          resolve(res.data.list);
        } else {
          reject(res);
        }
        // 非导出
        if (!currentPage) {
          emitter.emit("wv:dataLoad", res);
        }
      });
  });
};
const pageChangeHandler = (currPage) => {
  page = currPage;
  load();
};
</script>

<template>
  <div class="wv-table">
    <wd-loading
      :loading="loading || exporting"
      :text="
        exporting
          ? '数据导出中：当前第' + exportPage + '页，总共 ' + pageCount + '页'
          : '数据加载中'
      "
    >
      <wd-table
        ref="wdTable"
        :columns="config.columns"
        :data-source="records"
        :page-count="pageCount"
        text="数据加载中"
        empty-text="现在还没有数据噢~"
        @current-change="pageChangeHandler"
      >
        <template v-slot:custom="slotScope">
          <template v-if="slotScope.column.dataIndex === 'action'">
            <wd-button-group>
              <wd-button
                v-for="(button, index) in slotScope.column.buttons"
                :key="index"
                :size="button.size || 'small'"
                :type="button.type"
                @click="button.click"
                >{{ button.text }}
              </wd-button>
              <wd-button
                v-if="config.updateUrl && config.editConf"
                size="small"
                type="primary"
                @click="editHandler"
                >编辑
              </wd-button>
              <wd-button
                v-if="config.deleteUrl"
                size="small"
                type="danger"
                @click="deleteHandler(slotScope.row)"
                >删除
              </wd-button>
            </wd-button-group>
          </template>
        </template>
      </wd-table>
    </wd-loading>
    <wd-dialog
      v-model="isShowAddDialog"
      :title="opType === 'add' ? '新增' : '编辑'"
      :destroy-on-close="true"
      :append-to-body="true"
      @close="isShowAddDialog = false"
    >
      <wv-form :filters="config.addConf" v-model="formData"></wv-form>
      <template #footer>
        <wd-button type="primary" size="small" @click="saveHandler"
          >保存</wd-button
        >
        <wd-button size="small" @click="isShowAddDialog = false"
          >取消</wd-button
        >
      </template>
    </wd-dialog>
  </div>
</template>
<style scoped>
.wv-table {
  flex: 1;
  width: 100%;
  overflow-y: scroll;
}
</style>
<style>
.wd-dialog-mask {
  z-index: 999999 !important;
}
</style>

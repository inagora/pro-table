<script>
export default {
  name: "wvTable",
};
</script>
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
import { isFuction, isObject } from "../utils/util.js";

const config = inject("config");
// 处理列，排除hideInTable的配置
config.columns = config.columns.filter((item) => !item.hideInTable);
const wvTable = ref(null);
// 处理后的列，比如隐藏
const exportableColumns = [];
const _columns = [];
config.columns.forEach((column) => {
  if (column.visible || column.visible === undefined) {
    _columns.push(column);
  }
  if (!column.exportable) {
    exportableColumns.push(column);
  }
  // 设置了valueEnum需要格式化显示的值
  if (!column.render && column.valueEnum) {
    let valueEnum = {};
    if (isFuction(column.valueEnum)) {
      valueEnum = column.valueEnum();
    } else {
      valueEnum = column.valueEnum;
    }
    column.render = (_, row) => {
      return valueEnum[row[column.dataIndex]];
    };
  }
});
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
  _columns.forEach((column) => {
    column.width = flexColumnWidth(column.title);
  });
}

const emitter = inject("emitter");
emitter.on("wv:download", () => {
  download(exportableColumns, records.value);
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
  download(exportableColumns, allData);
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
const deleteHandler = (id) => {
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
            [config.idIndex]: id,
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
// 批量删除
emitter.on("wv:batchDelete", () => {
  const selectedRows = wvTable.value.getSelectedRows();
  if (!selectedRows || selectedRows.length === 0) {
    WdMessage({
      message: "选择要删除的项",
      type: "warning",
    });
    return;
  }
  deleteHandler(selectedRows.map((row) => row[config.idIndex]));
});
let allFixedRightEls;
let allFixedLeftEls;
onMounted(async () => {
  // if (config.autoRequest) {
  //   await load();
  // }
  if (config.pageMode === "waterfall") {
    document.querySelectorAll(".wd-pagination-item").forEach((item) => {
      item.style.display = "none";
    });
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
let count = 20;
let clickDirection = "prev";
let lastIndex = ""; // 瀑布流模式的最后一项
// count 默认20条
if (config.ajaxSetting.count) {
  count = config.ajaxSetting.count;
}
const ajax = new Ajax(config.ajaxSetting);
const load = (currentPage) => {
  // let searchParams = {
  //   page: currentPage || page,
  // };
  if (config.pageMode === "waterfall") {
    searchParams[config.idIndex] = lastIndex;
  } else {
    searchParams.page = currentPage || page;
  }
  searchParams.count = count;
  if (!currentPage) {
    emitter.emit("beforeDataRequest", searchParams);
    emitter.on("wv:beforeDataRequest", (val) => {
      searchParams = Object.assign({}, searchParams, val);
    });
  }
  loading.value = true;
  if (config.records) {
    records.value = config.records;
    return;
  }
  setTimeout(() => {
    return new Promise((resolve, reject) => {
      ajax
        .request({
          url: config.url,
          data: searchParams,
        })
        .then((res) => {
          loading.value = false;
          if (res && res.data.list) {
            if (clickDirection === "prev") {
              if (!res.data.list || res.data.list.length === 0) {
                document
                  .querySelector(".wd-pagination-prev")
                  .classList.remove("wd-pagination-disabled");
                return;
              }
            } else {
              if (res.data.list.length < Math.abs(count)) {
                document
                  .querySelector(".wd-pagination-next")
                  .classList.add("wd-pagination-disabled");
              }
            }
            records.value = res.data.list;
            pageCount.value = 3;
            resolve(res.data.list);
          } else {
            reject(res);
          }
          // 非导出
          if (!currentPage) {
            emitter.emit("dataLoad", res);
          }
        });
    });
  }, 0);
};
const pageChangeHandler = (currPage) => {
  page = currPage;
  load();
};
const prevClick = () => {
  lastIndex = records.value[0][config.idIndex] || "";
  clickDirection = "prev";
  count = -Math.abs(count);
  document
    .querySelector(".wd-pagination-next")
    .classList.remove("wd-pagination-disabled");
};
const nextClick = () => {
  lastIndex = records.value[records.value.length - 1][config.idIndex] || "";
  clickDirection = "next";
  count = Math.abs(count);
  document
    .querySelector(".wd-pagination-prev")
    .classList.remove("wd-pagination-disabled");
};
// 暴露事件
defineExpose({
  load,
});
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
        ref="wvTable"
        :columns="_columns"
        :data-source="records"
        :page-count="pageCount"
        :height="config.tableHeight"
        text="数据加载中"
        empty-text="现在还没有数据噢~"
        :pagination="config.showPagination"
        @current-change="pageChangeHandler"
        @prev-click="prevClick"
        @next-click="nextClick"
      >
        <template v-slot:custom="slotScope">
          <template v-if="slotScope.column.dataIndex === 'action'">
            <wd-button-group>
              <wd-button
                v-for="(button, index) in slotScope.column.buttons"
                :key="index"
                :size="button.size || 'small'"
                :type="button.type"
                @click="button.click(slotScope)"
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
                @click="deleteHandler(slotScope.row[config.idIndex])"
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
  /* overflow-y: scroll; */
}
</style>

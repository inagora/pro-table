<script setup>
import { inject, onMounted, ref } from "vue";
import { WdButton } from "@inagora/wd-view";
import { loadJs } from "../utils/util.js";

const config = inject("config");
const emitter = inject("emitter");
const toolbarBtns = ref([]);
onMounted(() => {
  toolbarBtns.value = config.toolbar || [];
  // 显示新增按钮
  if (config.addUrl) {
    toolbarBtns.value.unshift({
      type: "primary",
      text: "新增",
      click() {
        emitter.emit("opAdd");
      },
    });
  }
  // 下载，设置了downloadable，创建两个按钮
  if (config.downloadable) {
    loadJs(
      "https://oss.wandougongzhu.cn/lib/exceljs/4.2.1/dist/exceljs.min.js"
    );
  }

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
});
// upload按钮，仅支持xlsx或者csv，自动解析出json数据
const uploadInput = ref(null);
const changeHandler = (e, button) => {
  const reader = new FileReader();
  reader.onload = async (evt) => {
    const lines = await readExcel(evt.target.result);
    button.click(lines);
    uploadInput.value.value = ""; //读取后清空input file
  };
  reader.readAsBinaryString(e.target.files[0]);
};
const readExcel = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const workbook = new ExcelJS.Workbook();
      //await workbook.xlsx.readFile(filename);从文件读取
      //await workbook.xlsx.read(stream);从流读取
      //await workbook.xlsx.load(data);从 buffer 加载
      const result = await workbook.xlsx.load(file);
      // 按 name 提取工作表 workbook.getWorksheet('My Sheet');
      // 按 id 提取工作表 workbook.getWorksheet(1);
      const worksheet = result.getWorksheet();
      const lines = [];
      //遍历工作表中具有值的所有行
      worksheet.eachRow(function (row) {
        const [empty, ...line] = row.values;
        if (line.filter((f) => f).length > 0) {
          lines.push(line.map((m) => (m ? m.toString() : "")));
        }
      });
      resolve(lines);
    } catch (e) {
      reject(e);
    }
  });
};
</script>

<template>
  <div class="wv-toolbar">
    <template v-for="(button, index) in toolbarBtns" :key="index">
      <div v-if="button === '|'" class="wv-toolbar-separator">&nbsp;</div>
      <div
        v-else-if="button.subtype === 'upload'"
        class="wv-toolbar-upload-container"
      >
        <wd-button
          :type="button.type"
          :icon="button.icon"
          :loading="button.loading"
          :size="button.size"
        >
          {{ button.text }}
        </wd-button>
        <input
          ref="uploadInput"
          type="file"
          @change="changeHandler($event, button)"
        />
      </div>
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
.wv-toolbar-upload-container {
  position: relative;
}
.wv-toolbar-upload-container input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  left: 0;
  top: 0;
  cursor: pointer;
  font-size: 0;
}
</style>

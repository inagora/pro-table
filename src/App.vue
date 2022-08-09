<template>
  <div id="wd-table"></div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { init } from "./index.js";
const tableColumns = [
  {
    title: "",
    dataIndex: "",
    key: "",
    type: "checkbox",
    width: 80,
  },
  // {
  //     type: 'index',
  //     index: (index) => {
  //         return index * 2;
  //     }
  // },
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: (val) => {
      getSortData(val);
    },
  },
  {
    title: "商品名",
    dataIndex: "goods_name",
    key: "goods_name",
    ellipsis: true,
    // fixed: "left",
  },
  {
    title: "价格",
    dataIndex: "price",
    key: "price",
    // fixed: "left",
    sorter: (val) => {
      getSortData(val);
    },
    render(column, row) {
      return `<span style="color: red;">${row[column.dataIndex]}</span>`;
    },
  },
  {
    title: "生产日期",
    dataIndex: "ctime",
    key: "ctime",
    // fixed: "right",
  },
  {
    title: "产地",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "更新时间",
    dataIndex: "update_time",
    key: "update_time",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    // fixed: "right",
    width: "300px",
    buttons: [
      {
        type: "primary",
        text: "编辑",
        click() {},
      },
      {
        type: "danger",
        text: "删除",
        click() {},
      },
    ],
  },
];
let dataList = ref([]);
let total = ref(0);
const currentPage = ref(1);
const rowData = [];

setTimeout(() => {
  for (let i = 0; i < 15; i++) {
    rowData.push({
      id: "" + (4 + i),
      goods_name: "sk4",
      price: "1180",
      ctime: "2021-09-26 2021-09-26 2021-09-26 2021-09-26 2021-09-26",
      update_time: "2021-09-26",
      location: "中国",
    });
  }
  total.value = 200;
  dataList.value = rowData;
  currentPage.value = 3;
}, 2000);
onMounted(() => {
  init({
    el: "#wd-table",
    title: "pro-table",
    columns: tableColumns,
    records: dataList,
    searchFilters: [
      {
        type: "text",
        placeholder: "请输入姓名",
        label: "姓名",
        prop: "name",
      },
      {
        type: "number",
        placeholder: "请输入年龄",
        label: "年龄",
        prop: "age",
      },
    ],
    toolbar: [
      {
        type: "primary",
        text: "导出",
        // loading: true,
        click() {
          console.log(123);
        },
      },
      {
        type: "primary",
        text: "导出全部",
        // loading: true,
        click() {
          console.log(123);
        },
      },
      "|",
      {
        type: "danger",
        text: "批量删除",
        // loading: true,
        click() {
          console.log(123);
        },
      },
    ],
  });
});
</script>

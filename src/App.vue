<template>
  <pro-table :config="config" />
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { WdButton } from "@inagora/wd-view";
let sortKey = "";
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
      color: i % 2 === 0 ? "red" : "blue",
    });
  }
  total.value = 200;
  dataList.value = rowData;
  currentPage.value = 3;
}, 2000);
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
    fixed: "left",
    sorter: (val) => {
      getSortData(val);
    },
    visible: true, // 是否可见
    exportable: false, // 是否可导出
  },
  {
    title: "商品名商品名商品名商品名商品名商品名商品名商品名",
    dataIndex: "goods_name",
    key: "goods_name",
    ellipsis: true,
    fixed: "right",
  },
  {
    title: "价格",
    dataIndex: "price",
    key: "price",
    fixed: "left",
    sorter: (val) => {
      sortKey = val;
      console.log(app);
      // app.refresh();
    },
    render(column, row) {
      // return `<span style="color: red;">${row[column.dataIndex]}</span>`;
      return `<wd-button>${row[column.dataIndex]}</wd-button>`;
    },
    valueType: "text", // 表单类型
    defaultValue: "",
    valueEnum() {
      // 对应key的枚举值，减少render
      return {};
    },
  },
  {
    title: "颜色",
    dataIndex: "color",
    key: "color",
    // hideInTable: true,
    // render(column, row) {
    //   return `<span style="color: red;">${row[column.dataIndex]}</span>`;
    // },
    valueType: "multiple", // 表单类型
    defaultValue: "red",
    valueEnum() {
      // 对应key的枚举值，减少render，但是render的优先级更高
      return {
        red: "红色",
        green: "绿色",
        blue: "蓝色",
      };
    },
  },
  {
    title: "生产日期",
    dataIndex: "ctime",
    key: "ctime",
    valueType: "date",
    dateOptions: {
      format: "YYYY/MM/DD",
      valueFormat: "YYYY-MM-DD",
      picker: "month",
      placeholder: "生产日期",
    },
    // fixed: "right",
  },
  {
    title: "产地",
    dataIndex: "location",
    key: "location",
    hideInSearch: true,
  },
  {
    title: "生产日期",
    dataIndex: "update_time",
    valueType: "range",
    dateOptions: {
      format: "YYYY/MM/DD",
      valueFormat: "YYYY-MM-DD",
      placeholder: ["开始日期", "截止日期"],
    },
  },
  {
    title: "更新时间",
    dataIndex: "update_time",
    key: "update_time",
  },
  {
    title: "更新时间",
    dataIndex: "update_time",
    key: "update_time",
  },
  {
    title: "更新时间",
    dataIndex: "update_time",
    key: "update_time",
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
    fixed: "right",
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
const config = reactive({
  columns: tableColumns,
  downloadable: true,
  url: "http://123.57.68.108:8080",
  toolbar: [
    {
      type: "primary",
      text: "刷新",
      // loading: true,
      click() {
        // app.refresh();
      },
    },
    {
      type: "primary",
      text: "导出全部1",
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
    {
      type: "primary",
      subtype: "upload",
      text: "上传文件",
      click(val) {
        console.log(val);
      },
    },
    {
      type: "primary",
      text: "导出2",
      // loading: true,
      click() {
        console.log(123);
      },
    },
    {
      type: "primary",
      text: "导出全部2",
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
    {
      type: "upload",
      subtype: "upload",
      text: "上传文件",
      click(val) {
        console.log(val);
      },
    },
  ],
  searchAreaBtns: [
    {
      type: "primary",
      text: "自定义按钮",
      // loading: true,
      click() {
        console.log(123);
      },
    },
  ],
  listeners: {
    dataLoad(res) {
      console.log("dataload: ", res);
    },
    beforeDataRequest(data) {
      console.log(data);
      data.page = 3;
      if (sortKey) data.sortKey = sortKey;
      return data;
    },
    // beforeAdd() {},
    // beforeEdit() {},
    // beforeDelete() {},
    add() {},
    edit() {},
    delete() {},
    // beforeSearch(params) {},
    // beforeDownload(params) {},
  },
});
onMounted(() => {
  // const app = init({
  //   el: "#wd-table",
  //   // title: "pro-table",
  //   // tips: "<div>tips</div>",
  //   columns: tableColumns,
  //   downloadable: true,
  //   autoRequest: true,
  //   // tableHeight: "100px",
  //   // pageMode: "waterfall",
  //   // autoWidth: true,
  //   // records: dataList,
  //   url: "http://123.57.68.108:8080",
  //   addUrl: "http://123.57.68.108:8080",
  //   updateUrl: "http://123.57.68.108:8080",
  //   deleteUrl: "http://123.57.68.108:8080",
  //   batchDelete: true,
  //   // showPagination: true,
  //   addConf: [
  //     {
  //       type: "text",
  //       placeholder: "请输入ID",
  //       label: "ID",
  //       prop: "id",
  //       value: "123",
  //     },
  //     {
  //       type: "select",
  //       placeholder: "请选择学历",
  //       label: "学历",
  //       prop: "education",
  //       list: [
  //         {
  //           label: "研究生",
  //           value: 1,
  //         },
  //         {
  //           label: "本科",
  //           value: 2,
  //         },
  //       ],
  //     },
  //   ],
  //   searchFilters: [
  //     {
  //       type: "text",
  //       placeholder: "请输入姓名",
  //       label: "姓名",
  //       prop: "name",
  //     },
  //     {
  //       type: "number",
  //       placeholder: "请输入年龄",
  //       label: "年龄",
  //       prop: "age",
  //     },
  //     {
  //       type: "checkbox",
  //       label: "是否检查",
  //       prop: "isCheck",
  //     },
  //     {
  //       type: "select",
  //       placeholder: "请选择",
  //       label: "年份",
  //       prop: "year",
  //       list: [
  //         {
  //           label: "2022",
  //           value: "2022",
  //         },
  //         {
  //           label: "2023",
  //           value: "2023",
  //         },
  //       ],
  //       change(val) {
  //         console.log(app._instance.ctx.searchFilters[4].list);
  //         app._instance.ctx.searchFilters[4].list = [
  //           {
  //             label: "研究生",
  //             value: 1,
  //           },
  //           {
  //             label: "本科",
  //             value: 2,
  //           },
  //         ];
  //       },
  //     },
  //     {
  //       type: "select",
  //       placeholder: "请选择学历",
  //       label: "学历",
  //       prop: "education",
  //       change(val) {
  //         console.log(val);
  //       },
  //     },
  //     {
  //       type: "date",
  //       placeholder: "请选择时间",
  //       label: "开始时间",
  //       prop: "start_time",
  //       options: {
  //         format: "YYYY/MM/DD",
  //         valueFormat: "YYYY-MM-DD",
  //       },
  //     },
  //   ],
  //   toolbar: [
  //     {
  //       type: "primary",
  //       text: "刷新",
  //       // loading: true,
  //       click() {
  //         app.refresh();
  //       },
  //     },
  //     {
  //       type: "primary",
  //       text: "导出全部1",
  //       // loading: true,
  //       click() {
  //         console.log(123);
  //       },
  //     },
  //     "|",
  //     {
  //       type: "danger",
  //       text: "批量删除",
  //       // loading: true,
  //       click() {
  //         console.log(123);
  //       },
  //     },
  //     {
  //       type: "primary",
  //       subtype: "upload",
  //       text: "上传文件",
  //       click(val) {
  //         console.log(val);
  //       },
  //     },
  //     {
  //       type: "primary",
  //       text: "导出2",
  //       // loading: true,
  //       click() {
  //         console.log(123);
  //       },
  //     },
  //     {
  //       type: "primary",
  //       text: "导出全部2",
  //       // loading: true,
  //       click() {
  //         console.log(123);
  //       },
  //     },
  //     "|",
  //     {
  //       type: "danger",
  //       text: "批量删除",
  //       // loading: true,
  //       click() {
  //         console.log(123);
  //       },
  //     },
  //     {
  //       type: "upload",
  //       subtype: "upload",
  //       text: "上传文件",
  //       click(val) {
  //         console.log(val);
  //       },
  //     },
  //   ],
  //   searchAreaBtns: [
  //     {
  //       type: "primary",
  //       text: "自定义按钮",
  //       // loading: true,
  //       click() {
  //         console.log(123);
  //       },
  //     },
  //   ],
  //   listeners: {
  //     dataLoad(res) {
  //       console.log("dataload: ", res);
  //     },
  //     beforeDataRequest(data) {
  //       console.log(data);
  //       data.page = 3;
  //       if (sortKey) data.sortKey = sortKey;
  //       return data;
  //     },
  //     // beforeAdd() {},
  //     // beforeEdit() {},
  //     // beforeDelete() {},
  //     add() {},
  //     edit() {},
  //     delete() {},
  //     // beforeSearch(params) {},
  //     // beforeDownload(params) {},
  //   },
  // });
});
</script>

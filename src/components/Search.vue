<script setup>
import { inject, onMounted, ref } from "vue";
import ADatePicker from "ant-design-vue/lib/date-picker";
import { RangePicker } from "ant-design-vue/lib/date-picker/dayjs";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import "ant-design-vue/lib/date-picker/style/index.css";
import {
  WdForm,
  WdFormItem,
  WdInput,
  WdSelect,
  WdOption,
  WdDatePicker,
  WdRadio,
  WdCheckbox,
  WdSwitch,
  WdButton,
  WdInputNumber,
} from "@inagora/wd-view";
import { isObject, isFuction } from "../utils/util";
const config = inject("config");
const emitter = inject("emitter");
const filterMap = {
  text: WdInput,
  datetime: WdDatePicker,
  date: ADatePicker,
  range: RangePicker,
  number: WdInputNumber,
  select: WdSelect,
  multiple: WdSelect,
  checkbox: WdCheckbox,
  switch: WdSwitch,
  radio: WdRadio,
};
const formData = ref({});
const searchFilters = ref([]);
// format filter
const formatFilter = (valueEnum) => {
  return Object.keys(valueEnum).map((key) => {
    return {
      label: valueEnum[key],
      value: key,
    };
  });
};
config.columns.forEach((column) => {
  if (
    !column.hideInSearch &&
    column.dataIndex &&
    column.dataIndex !== "action"
  ) {
    const filter = {
      type: column.valueType || "text",
      placeholder: column.placeholder,
      label: column.title,
      prop: column.dataIndex,
      dateOptions: column.dateOptions || {},
      list: [],
      value: column.defaultValue,
      change: column.change || null,
    };
    if (column.valueType === "select" || column.valueType === "multiple") {
      if (column.valueEnum) {
        if (isFuction(column.valueEnum)) {
          const valueEnum = column.valueEnum();
          if (isObject(valueEnum)) {
            filter.list = formatFilter(valueEnum);
          }
        } else {
          if (isObject(column.valueEnum)) {
            filter.list = formatFilter(column.valueEnum);
          }
        }
      }
    }
    searchFilters.value.push(filter);
  }
});
searchFilters.value.forEach((filter) => {
  formData.value[filter.prop] = filter.value || "";
});
const searchHandler = () => {
  emitter.emit("wv:search", formData.value);
};
onMounted(() => {
  if (config.autoRequest) {
    searchHandler();
  }
});
const changeHandler = (val, fn) => {
  fn && fn(val);
};
// formConf
// 自定义搜索
// 自定义其他按钮
</script>

<template>
  <div class="wv-search">
    <wd-form
      ref="searchForm"
      label-align="right"
      size="small"
      label-position="top"
      inline
    >
      <wd-form-item
        v-for="filter in searchFilters"
        :key="filter.prop"
        :label="filter.label"
        :prop="filter.prop"
      >
        <wd-select
          v-if="filter.type === 'select' || filter.type === 'multiple'"
          width="150px"
          :is="filterMap[filter.type]"
          :placeholder="filter.placeholder"
          :value="formData[filter.prop]"
          :multiple="filter.type === 'multiple'"
          v-model="formData[filter.prop]"
          @change="changeHandler($event, filter.change)"
        >
          <wd-option
            v-for="(option, index) in filter.list"
            :key="index"
            :label="option.label"
            :value="option.value"
          ></wd-option>
        </wd-select>
        <a-date-picker
          v-else-if="filter.type === 'date'"
          :value="formData[filter.prop]"
          v-model:value="formData[filter.prop]"
          v-bind="filter.dateOptions"
          :size="filter.dateOptions?.size || 'small'"
          :locale="locale"
        ></a-date-picker>
        <range-picker
          v-else-if="filter.type === 'range'"
          :value="formData[filter.prop]"
          v-model:value="formData[filter.prop]"
          v-bind="filter.dateOptions"
          :size="filter.dateOptions?.size || 'small'"
          :locale="locale"
        ></range-picker>
        <component
          v-else
          :is="filterMap[filter.type]"
          :placeholder="filter.placeholder"
          :value="formData[filter.prop]"
          v-model="formData[filter.prop]"
        >
        </component>
      </wd-form-item>
      <wd-form-item label="">
        <div class="wv-search-btns">
          <wd-button type="primary" size="small" @click="searchHandler"
            >搜索</wd-button
          >
          <wd-button v-if="config.resetable" size="small">重置</wd-button>
          <div
            v-if="config.searchAreaBtns && config.searchAreaBtns.length > 0"
            class="wv-toolbar-separator"
          >
            &nbsp;
          </div>
          <template v-if="config.searchAreaBtns">
            <wd-button
              v-for="(button, index) in config.searchAreaBtns"
              :key="index"
              @click="button.click"
              :type="button.type"
              :icon="button.icon"
              :loading="button.loading"
              :size="button.size"
              >{{ button.text }}</wd-button
            >
          </template>
        </div>
      </wd-form-item>
    </wd-form>
  </div>
</template>
<style>
.wv-search {
  border-bottom: 1px solid #d0d0d0;
  padding: 10px 0 10px 10px;
}
.wv-search-btns {
  display: flex;
  align-items: center;
  gap: 10px 8px;
}
.wd-select {
  min-width: 150px;
}
.wd-form-inline {
  gap: 10px;
}
.wd-form-inline .wd-form-item {
  margin-right: 0;
}
.wd-form-inline .wd-form-item-with-help {
  margin-bottom: 0;
}
</style>

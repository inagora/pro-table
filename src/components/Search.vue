<script setup>
import { inject } from "vue";
import {
  WdForm,
  WdFormItem,
  WdInput,
  WdSelect,
  WdDatePicker,
  WdRadio,
  WdCheckbox,
  WdSwitch,
  WdButton,
  WdInputNumber,
} from "@inagora/wd-view";
const config = inject("config");
const filterMap = {
  text: WdInput,
  datetime: WdDatePicker,
  date: WdDatePicker,
  number: WdInputNumber,
  combobox: WdSelect,
  multiple: WdSelect,
  checkbox: WdCheckbox,
  switch: WdSwitch,
};

// formConf
// 自定义搜索
// 自定义其他按钮
</script>

<template>
  <div class="wv-search">
    <wd-form
      ref="userInfoForm"
      label-align="right"
      size="small"
      action="/login"
      method="post"
      label-position="top"
      inline
    >
      <wd-form-item
        v-for="filter in config.searchFilters"
        :key="filter.prop"
        :label="filter.label"
        :prop="filter.prop"
      >
        <component
          :is="filterMap[filter.type]"
          :placeholder="filter.placeholder"
        ></component>
      </wd-form-item>
      <wd-form-item label="">
        <wd-button type="primary" nativeType="submit" size="small"
          >搜索</wd-button
        >
      </wd-form-item>
    </wd-form>
  </div>
</template>
<style scoped>
.wv-search {
  border-bottom: 1px solid #d0d0d0;
  padding: 10px 0 0 10px;
}
</style>

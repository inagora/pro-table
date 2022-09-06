<script setup>
import { inject, ref } from "vue";
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
const config = inject("config");
const emitter = inject("emitter");
const filterMap = {
  text: WdInput,
  datetime: WdDatePicker,
  date: WdDatePicker,
  number: WdInputNumber,
  select: WdSelect,
  checkbox: WdCheckbox,
  switch: WdSwitch,
  radio: WdRadio,
};
const formData = ref({});
config.searchFilters.forEach((filter) => {
  formData.value[filter.prop] = filter.value || "";
});
const searchHandler = () => {
  emitter.emit("wvSearch", formData.value);
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
        v-for="filter in config.searchFilters"
        :key="filter.prop"
        :label="filter.label"
        :prop="filter.prop"
      >
        <component
          :is="filterMap[filter.type]"
          :placeholder="filter.placeholder"
          :value="formData[filter.prop]"
          v-model="formData[filter.prop]"
        >
          <template v-if="filter.list">
            <wd-option
              v-for="(option, index) in filter.list"
              :key="index"
              :label="option.label"
              :value="option.value"
            ></wd-option>
          </template>
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
<style scoped>
.wv-search {
  border-bottom: 1px solid #d0d0d0;
  padding: 10px 0 0 10px;
}
.wv-search-btns {
  display: flex;
  align-items: center;
}
.wv-toolbar-separator {
  margin-left: 8px;
  margin-bottom: 0;
}
</style>
<style>
.wd-select {
  width: 150px !important;
}
.popper {
  z-index: 999999 !important;
}
</style>

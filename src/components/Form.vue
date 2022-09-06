<script setup>
import { ref } from "vue";
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
const props = defineProps({
  filters: Array,
  modelValue: Object,
});
const filters = ref(props.filters);
const formData = ref(props.modelValue);
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
</script>

<template>
  <div class="wv-form">
    <wd-form
      ref="wvForm"
      label-align="right"
      size="small"
      action="/login"
      method="post"
      label-position="top"
    >
      <wd-form-item
        v-for="filter in filters"
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
    </wd-form>
  </div>
</template>
<style>
.wd-select {
  width: 150px !important;
}
.popper {
  z-index: 999999 !important;
}
</style>

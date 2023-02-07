<script setup>
import { inject } from "vue";
const config = inject("config");
</script>

<template>
  <div v-if="config.tips" class="wv-tips" v-html="config.tips"></div>
</template>
<style scoped>
.wv-tips {
  border-bottom: 1px solid #d0d0d0;
  padding: 10px;
}
</style>

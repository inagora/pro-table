<script setup>
import { inject } from "vue";
const config = inject("config");
</script>

<template>
  <div v-if="config.title" class="wv-title">
    {{ config.title }}
  </div>
</template>
<style scoped>
.wv-title {
  color: #191919;
  height: 40px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #d0d0d0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding-left: 10px;
  font-weight: 500;
}
</style>

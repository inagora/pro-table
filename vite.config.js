import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "src/index.js",
      name: "ProTable",
      fileName: () => `index.js`, // 如果直接使用index.js，文件名为cjs后缀
      formats: ["umd"],
      library: "ProTable",
    },
  },
  define: {
    // umd模式下提示process undefined，需要增加以下配置
    "process.env": {},
  },
  rollupOptions: {
    external: ["vue", "ant-design-vue", "wd-view"],
    output: {
      globals: {
        vue: "Vue",
        "wd-view": "WdView",
      },
      filename: "index.js",
      path: "dist",
      libraryTarget: "umd",
      library: "ProTable",
    },
  },
});

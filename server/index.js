import Koa from "koa";
import goodsList from "./data.js";
const app = new Koa();
// 处理跨域
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "GET");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with");
  if (ctx.method === "OPTIONS") {
    ctx.body = 200;
  } else {
    await next();
  }
});
app.use((ctx) => {
  ctx.set({
    "Content-Type": "application/json; charset=utf-8",
  });
  ctx.body = {
    data: {
      list: goodsList,
      total: 100,
      page_count: 5,
      page: 1,
    },
  };
});
app.listen(8080);

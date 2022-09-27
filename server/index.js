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
  let count = ctx.query.count;
  let id = ctx.query.id;
  console.log(id);
  let idIndex = goodsList.findIndex(item => item.id === id);
  console.log(idIndex);
  if(idIndex < 0) idIndex = 0;
  let resultList = []
  if(count > 0) {
    resultList = goodsList.slice(idIndex + 1, idIndex + parseInt(count))
  } else {
    resultList = goodsList.slice(idIndex + parseInt(count), idIndex + 1)
  }
  ctx.body = {
    data: {
      list: resultList,
      total: 100,
      page_count: 1,
      page: 1,
    },
  };
});
app.listen(8080);

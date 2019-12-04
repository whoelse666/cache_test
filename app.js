/*
 * @Description:
 * @Author:RONGWEI PENG
 * @Date: 2019-12-04 20:47:59
 * @LastEditors: RONGWEI PENG
 * @LastEditTime: 2019-12-04 22:44:06
 */
const chalk = require("chalk");
const log = console.log;

const Koa = require("koa");
const router = require("koa-router")();
const static = require("koa-static");
const moment = require("moment");
const readFile = require("fs-readfile-promise");

const app = new Koa();
app.use(static(__dirname + "/"));

const MyCache = require("./cache.js");

let conf = {
  cacheTime: moment()
    .startOf("day")
    .unix()
};
app.use(new MyCache(conf));

router.get("/", ctx => {
  ctx.body = "this is  index";
});
router.get("/demo", async ctx => {
  const url = ctx.request.url;
  log(url);

  let key = 123456789;

  await readFile("./demo.json").then((data, err) => {
    if (err) throw err;
    log("读取" + key + "数据...", data.toString());
    ctx.body = data.toString();
  });
});

app.use(router.routes());

let port = 9090;
app.listen(port, () => {
  log(chalk.yellow("启动成功,端口=", port));
});

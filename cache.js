/*
 * @Description:
 * @Author: RONGWEI PENG
 * @Date: 2019-12-04 20:48:06
 * @LastEditors: RONGWEI PENG
 * @LastEditTime: 2019-12-04 23:05:24
 */

const moment = require("moment");
const readFile = require("fs-readfile-promise");

class Cache {
  constructor(conf) {
    this.cacheTime = conf.cacheTime | 0;
    this.cache = {};

    this.clearCacheByDay = this.clearCacheByDay.bind(this);
    this.middleware = this.middleware.bind(this);
    this.clearCacheByDay();

    return this.middleware;
  }

  clearCacheByDay() {
    // 清理缓存
    setInterval(() => {
      let compareTime = moment()
        .startOf("day")
        .unix(); //秒
      // console.log(
      //   "时间戳比较",
      //   moment()
      //     .endOf("day")
      //     .format("HH:mm:ss ") === new Date().toTimeString().slice(0, 8)
      // );
      if (
        moment()
          .endOf("day")
          .format("HH:mm:ss") === new Date().toTimeString().slice(0, 8)
      ) {
        console.log("清除缓存.......");
        this.cache = {};
      }
    }, 1000);
  }

  async middleware(ctx, next) {
    // console.log("ctx,next===", ctx, next);
    let { url, method } = ctx;
    let key = `cacheName=${method}`;

    let data = this.cache[key];
    // console.log(123456, this.cache[key]);
    if (data) {
      console.log("有缓存!!!");
      ctx.body = { text: "有缓存!!!", ...data };
      return;
    } else {
      console.log("没有缓存!!!");
      await readFile("./demo.json").then((data, err) => {
        if (err) throw err;
        ctx.body = data.toString();
        this.cache[key] = JSON.parse(data.toString());

        // console.log(123456, this.cache[key]);
      });
    }
  }
}

module.exports = Cache;

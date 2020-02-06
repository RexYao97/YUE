const express = require("express");
const app = express();
const fs = require("fs");
const cheerio = require("cheerio");
const superagent = require("superagent");
let data = require("./data");
let defaultData = require("./defaultData");
/**
 * 数据库 id
 */
let objecId = require("mongo-objectid");
function httpGet() {
  return new Promise((res, rej) => {
    superagent
      .get(
        `https://ncov.dxy.cn/ncovh5/view/pneumonia_peopleapp?from=timeline&isappinstalled=0&scene=126&clicktime=${Date.parse(
          new Date()
        )}`
      )
      .end((_err, _res) => {
        if (_err) {
          // 如果访问失败或者出错，会这行这里
          console.log(`抓取失败 - ${_err}`);
          rej(_err);
        } else {
          return res(_res);
        }
      });
  });
}

app.get("/", async (req, res) => {
  let result = await httpGet();
  res.send(handleDate(result));
});
/**
 *
 * @param {返回数据} res
 */
function handleDate(res) {
  res = cheerio("script", res.text);
  let reslut = "";
  try {
    for (let [key, value] of Object.entries(res)) {
      // console.log( typeof value.children, isNaN(key))
      if (isData(key, value) && /getAreaStat/g.test(value.children[0].data)) {
        // console.log(value.children[0].data.slice(43,-11))
        reslut = value.children[0].data.slice(26, -11);
        writeDate(JSON.parse(reslut));
      }
    }
  } catch (e) {
    throw new Error(e);
  }

  return reslut;
}
/**
 *
 * @param {cheeiro 中的排位} key
 * @param {cheerio 中的 数据*} value
 */
function isData(key, value) {
  return (
    !isNaN(key) &&
    value &&
    value.children &&
    value.children.length > 0 &&
    typeof value.children[0].data === "string"
  );
}
/**
 *
 * @param {请求的数据}}object reslut
 */
function writeDate(reslut) {
  let date = new Date();
  let r = defaultData;
  /**
   * path 保存路径
   */
  let path = `./home/${date.getMonth()}-${date.getDate()} ${date.getHours()} ${date.getMinutes()} ${date.getMilliseconds()}.json`;
  for (let item of reslut) {
    let name = getCityName(item.provinceShortName);
    // console.log(item)
    if (name) {
        /**
         * 匹配到的名字 保存到对应数据
         * item 由于 writeFileSync 需要string格式
         */
      r.data[0][name] = JSON.stringify(item);
    }
  }
  r.data[0]["id"] = new objecId().toString();
  r.data[0]["created_at"] = Date.parse(date);
  r.data[0]["updated_at"] = Date.parse(date);
  fs.writeFileSync(path, JSON.stringify(r));
}
/**
 * 
 * @param {城市缩写} provinceShortName 
 */
function getCityName(provinceShortName) {
  for (let item of data) {
    if (item.value === provinceShortName) {
      return item.name;
    }
  }
  return false;
}
/**
 * 监听路由
 */
let server = app.listen(3000, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Your App is running at http://%s:%s", host, port);
});

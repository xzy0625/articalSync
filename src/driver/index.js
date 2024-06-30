import JuejinAdapter from './drivers/juejin.js'
import ZhihuAdapter from './drivers/zhihu.js'
function importAll(r) {
  const modulesObj = {};
  const modulesArr = [];
  r.keys().forEach((key) => {
    const module = r(key);
    const defaultExport = module.default;
    const moduleName = defaultExport ? defaultExport.name : null;
    if (moduleName && moduleName !== "Adapter") {
      modulesObj[moduleName] = defaultExport;
      modulesArr.push(defaultExport);
    }
  });
  return {
    modulesObj,
    modulesArr,
  };
}

// 所有的驱动
// const allDrivers = importAll(require.context("../../../utils/articalSync/driver/drivers", false, /\.js$/));

export const allDrivers = {
  modulesObj: {},
  modulesArr: [JuejinAdapter, ZhihuAdapter],
}

/* eslint-disable no-await-in-loop */
let lastFetchTime = null;
let cacheUsers = null;

const chunk = (arr, size) =>
  Array.from({length: Math.ceil(arr.length / size)}, (v, i) => arr.slice(i * size, i * size + size));

// 获取所有的账户
export async function getPublicAccounts() {
  // 限制20s 保证不会太频繁请求平台
  if (lastFetchTime != null) {
    const isTooQuickly = Date.now() - lastFetchTime < 20 * 1000;
    if (isTooQuickly) {
      console.log("too quickly return by cache");
      return cacheUsers;
    }
  }

  var drivers = allDrivers.modulesArr.map((Driver) => new Driver());

  var users = [];

  const stepItems = chunk(drivers, 20);
  const startTime = Date.now();
  for (let index = 0; index < stepItems.length; index++) {
    try {
      const stepItem = stepItems[index];
      const results = await Promise.all(
        stepItem.map((driver) => {
          return new Promise((resolve) => {
            console.log(222, '这里进来了');
            driver.getMetaData().then(resolve, () => {
              resolve(null);
            });
          });
        }),
      );
      const successAccounts = results.filter(Boolean);
      users = users.concat(successAccounts);
    } catch (e) {
      console.log("chunkPromise", e);
    }
  }

  const spend = Date.now() - startTime;
  console.log("getPublicAccounts spend", spend, "driverCount", drivers.length);
  lastFetchTime = Date.now();
  cacheUsers = users;
  return users;
}
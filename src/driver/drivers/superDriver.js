import request from "../../helper/request";

export default class Adapter {
  constructor(version, name, origin = {}) {
    this.name = name;
    this.version = version;
    this.origin = origin;
    this.modifyRequestHeaders = this.modifyRequestHeaders.bind(this);
  }

  modifyRequestHeaders() {
    
  }

  getAdapterInfo() {
    return `适配器: ${this.name}, 版本: ${this.version}`;
  }

  // 内置请求
  innerRequest(params) {
    return request({
      method: "GET",
      ...params,
    });
  }

  getMetaData() {
    console.log("获取用户信息");
  }
}

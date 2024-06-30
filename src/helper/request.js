import axios from "axios";

export default function request(params) {
  const innerParams = {
    ...params,
  };
  return new Promise((resolve, reject) => {
    axios(innerParams).then(
      (res) => {
        resolve(res);
      },
      (err) => {
        console.log(`调用失败, 参数 ${JSON.stringify(innerParams)}`);
        reject(err);
      },
    );
  });
}

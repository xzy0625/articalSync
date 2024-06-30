import { allDrivers, getPublicAccounts } from "../driver/index";
import Store from "../db/store";

var drivers = allDrivers.modulesArr.map((Driver) => new Driver());

async function updateRules() {
  // https://blog.csdn.net/weixin_44786530/article/details/128848739
  // https://blog.csdn.net/weixin_44786530/article/details/128817318
  const rule = [
    {
      id: 2,
      priority: 2,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          { header: "Referer", operation: "set", value: "https://juejin.cn" },
          { header: "Origin", operation: "set", value: "https://juejin.cn/" },
        ],
      },
      condition: {
        urlFilter: "https*",
        resourceTypes: ["xmlhttprequest"],
      },
    },
    {
      id: 3,
      priority: 3,
      condition: {
        urlFilter: "http://127.0.0.1*",
        resourceTypes: ["xmlhttprequest"],
      },
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          {
            header: "Access-Control-Allow-Origin",
            operation: "set",
            value: "*",
          },
        ],
      },
    },
  ];

  // 首选去掉原来的规则
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [2, 3] });
  await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rule });
}
function listenRequest() {
  var self = this;
  chrome.runtime.onMessage.addListener((
    request,
    sender,
    sendResponseA
  ) => {
    if (request.action && request.action == "getAccount") {
      ;(async () => {
        const publicAccounts = await getPublicAccounts();
        sendResponseA(publicAccounts)
      })()
    }
    if (request.action && request.action == "addTask") {
      console.log(request);
      request.task.status = "wait";
      request.task.guid = getGuid();
      db.addTask(request.task);
      // brocast message to the front end
      self.senders[request.task.guid] = sender;
      sendResponseA(request.task.guid);
      try {
        var newTask = request.task;
        tracker.sendEvent("add", "link", request.task.post.link);
        tracker.sendEvent(
          "add",
          "title",
          [
            request.task.post.title,
            newTask.accounts.map((account) => {
              return [account.type, account.uid, account.title].join("-");
            }),
          ].join(";;")
        );
      } catch (e) {
        console.log(e);
      }
    }

    return true; // return true告诉Chrome你将异步地发送响应。这样Chrome就会保持sendResponse回调的有效性，直到准备好发送响应
  });
}

const init = async () => {
  listenRequest();
  // updateRules();
};

init();
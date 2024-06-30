const _rules = {}

/**
 * 从webRequest中替换headers或监听请求
 * @function
 * @param {string} ulrPrefix - 要修改的链接匹配串
 * @param {string} headers - 要修改为的headers.
 * @param {array} inspectUrls - 需要监听的url结构.
 * @param {function} handler - 或者自己处理的回调函数.
 */
export function modifyRequestHeaders(ulrPrefix, headers, inspectUrls, handler) {
  // once
  if (!_rules[ulrPrefix]) {
    _rules[ulrPrefix] = headers
  }
  console.log('modifyRequestHeaders', ulrPrefix)
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      try {
        var macthedUrl = details.url.indexOf(ulrPrefix) > -1
        if (macthedUrl) {
          details.requestHeaders = details.requestHeaders.map(_ => {
            if (headers[_.name]) {
              _.value = headers[_.name]
            }
            return _
          })

          Object.keys(headers).forEach(name => {
            var existsHeaders = details.requestHeaders.filter(
              _ => _.name == name
            )
            if (existsHeaders.length) {
            } else {
              details.requestHeaders.push({
                name: name,
                value: headers[name],
              })
            }
          })
        }
        // call
        if (handler) {
          handler(details)
        }
      } catch (e) {
        console.log('modify headers error', e)
      }
      return { requestHeaders: details.requestHeaders }
    },
    {
      urls: inspectUrls,
    },
    ['blocking', 'requestHeaders', 'extraHeaders']
  )
}

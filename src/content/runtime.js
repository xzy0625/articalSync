// 获取所有的账户信息
export const getAllAccounts = () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: "getAccount",
      },
      (resp) => {
        resolve(resp)
      }
    );
  })
}

export const getPost = () => {
  var post = {}
  post.title = document.body.getAttribute('data-msg_title')
  post.content = $('#js_content').html()
  post.thumb = document.body.getAttribute('data-msg_cdn_url')
  post.desc = document.body.getAttribute('data-msg_desc')
  post.nickname = document.body.getAttribute('data-nickname')
  post.publish_time = document.body.getAttribute('data-ct')
  post.link = window.location.href
  console.log(post)
  return post
}
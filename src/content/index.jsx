/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


// 创建dom
const createDom = () => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}

// 渲染
const render = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

export const init = async () => {
    createDom();
    render();
}

init();

window.showArticalSync = () => {
  init();
}
/*
* 该模块用于配置公众号的菜单
* */

let Auth = require('./auth')
let rp = require('request-promise-native')

;(async()=>{
  let auth = new Auth()
  let {access_token} = await auth.fetchAccessToken()
  createMenu(access_token,menuObject)
})()

//1.创建菜单的方法
async function createMenu(access_token,menuObject) {
  const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`
  let createResult = await rp({
    method:'POST',
    url,
    json:true,
    body:menuObject
  })
  console.log(createResult)
}

let menuObject = {
  "button": [
    {
      "name": "扫码",
      "sub_button": [
        {
          "type": "scancode_waitmsg",
          "name": "扫码带提示",
          "key": "rselfmenu_0_0",
          "sub_button": [ ]
        },
        {
          "type": "scancode_push",
          "name": "扫码推事件",
          "key": "rselfmenu_0_1",
          "sub_button": [ ]
        }
      ]
    },
    {
      "name": "发图",
      "sub_button": [
        {
          "type": "pic_sysphoto",
          "name": "系统拍照发图",
          "key": "rselfmenu_1_0",
          "sub_button": [ ]
        },
        {
          "type": "pic_photo_or_album",
          "name": "拍照或者相册发图",
          "key": "rselfmenu_1_1",
          "sub_button": [ ]
        },
        {
          "type": "pic_weixin",
          "name": "微信相册发图",
          "key": "rselfmenu_1_2",
          "sub_button": [ ]
        }
      ]
    },
    {
      "name": "发送位置",
      "type": "location_select",
      "key": "rselfmenu_2_0"
    },
  ]
}
/*
* 该模块用于“第一手”响应微信服务器的消息
* */
let sha1 = require('sha1')
let config = require('../config')
let {parseString} = require('xml2js')
module.exports = async (request,response,next)=>{
  /*
  * 1.在网页上配置开发者服务器的时候，微信服务器会返回给开发者服务器如下信息
       { signature: 'ae7a320a97c7956ee21b7c265ba06bc9d2ef2df8',//微信服务器经过特殊加密后的字符串
          echostr: '2290394422019354525',//微信服务器生成的一个随机的字符串
          timestamp: '1561798556',//时间戳
          nonce: '942550499' }//微信服务器生成的一个随机数字

     2.验证服务器有效性步骤：
          1.将微信服务器发过来的timestamp，nonce，事先在网页里约定好的token(atguigu),存入一个数组中，随后对数组进行字典排序。
          2.将上述字典排序过的数组，每一个项取出，拼成一个字符串
          3.将第二步的字符串进行sha1加密
          4.将加密的结果与signature进行对比
              -- 一致：返回给微信服务器：echostr
              -- 不一致：非法请求，驳回请求
  */

  /*
  * 微信服务器能够给开发者服务器发送2种类型的消息：
  *     1.验证服务器有效性的消息 ---- GET
  *     2.转发用户的消息 --- POST
  * */
  //当微信服务器给开发者服务器发来验证有效性请求时，发送的是GET请求
  let {signature,echostr,timestamp,nonce} = request.query
  let {Token} = config
  //1.将微信服务器发过来的timestamp，nonce，事先在网页里约定好的token(atguigu),存入一个数组中，随后对数组进行字典排序
  let arr = [timestamp,nonce,Token].sort()
  //2.将上述字典排序过的数组，每一个项取出，拼成一个字符串
  let sha1Str = sha1(arr.join(''))

  //微信服务器发来了验证有效性请求
  if(request.method === 'GET' && sha1Str === signature){
    console.log('微信服务器发来了验证有效性请求,验证通过！')
    response.send(echostr)
  }

  //微信服务器转发了用于的消息
  else if(request.method === 'POST' && sha1Str === signature){
    console.log('微信服务器转发了用户的消息')
    //微信服务器转发给开发者用户消息时，是以xml格式发送过来的流式数据

    //1.获取微信服务器发过来的XML格式的数据
    let xmlData = await getXMLData(request)

    //2.将上一步获取到的xml数据，转换为js中的对象
    let jsObjectData = parseXML2js(xmlData)

    //3.进一步格式化数据
    let userInput = formatObjectData(jsObjectData)
    console.log(userInput);
  }

  //过来的是非法请求
  else{
    response.send('err')
  }

}

//获取微信服务器发过来的XML格式的数据
function getXMLData(request) {
  /*
    <xml>
      <ToUserName><![CDATA[gh_afd83bce98ae]]></ToUserName>
      <FromUserName><![CDATA[o1KCX0_v9SZYkIlfb1NITuA2lL-U]]></FromUserName>
      <CreateTime>1561948006</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[你好啊]]></Content>
      <MsgId>22361719730480675</MsgId>
    </xml>
    */
  return new Promise((resolve,reject)=>{
    let result = ''
    request.on('data',(data)=>{
      result += data.toString()
    })
    request.on('end',()=>{
      resolve(result)
    })
  })
}

//将xml数据转换为js对象
function parseXML2js(xmlData) {
  /*
    { xml:
      { ToUserName: [ 'gh_afd83bce98ae' ],
        FromUserName: [ 'o1KCX0_v9SZYkIlfb1NITuA2lL-U' ],
        CreateTime: [ '1561951739' ],
        MsgType: [ 'text' ],
        Content: [ '我饿了' ],
        MsgId: [ '22361768904097058' ] }
    }
  */
  let result
  parseString(xmlData,{trim:true},(err,data)=>{
    if(!err){
      result = data
    }else{
      console.log('进行xml转换js时出现错误',err)
    }
  })

  return result
}

//进一步格式化数据
function formatObjectData({xml}) {
  /*
    { xml:
      { ToUserName: [ 'gh_afd83bce98ae' ],
        FromUserName: [ 'o1KCX0_v9SZYkIlfb1NITuA2lL-U' ],
        CreateTime: [ '1561951739' ],
        MsgType: [ 'text' ],
        Content: [ '我饿了' ],
        MsgId: [ '22361768904097058' ] }
    }

    { ToUserName: 'gh_afd83bce98ae',
      FromUserName: 'o1KCX0_v9SZYkIlfb1NITuA2lL-U',
      CreateTime: '1561951739',
      MsgType: 'text',
      Content: '我饿了',
      MsgId: '22361768904097058'
    }
  */
  let result = {}
  for (let key in xml){
    result[key] = xml[key][0]
  }
  return result
}



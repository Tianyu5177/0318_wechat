/*
* 该模块用于解析微信服务器转发的用户消息
* */
let {parseString} = require('xml2js')
module.exports = {
  //获取微信服务器发过来的XML格式的数据
  getXMLData(request) {
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
},

  //将xml数据转换为js对象
  parseXML2js(xmlData) {
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
},

  //进一步格式化数据
  formatObjectData({xml}) {
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
}
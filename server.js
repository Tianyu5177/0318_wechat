let express = require('express')
let sha1 = require('sha1')

let app = express()
app.use(express.urlencoded({extended:true}))

app.use((request,response,next)=>{
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
  * */

  let {signature,echostr,timestamp,nonce} = request.query
  //1.将微信服务器发过来的timestamp，nonce，事先在网页里约定好的token(atguigu),存入一个数组中，随后对数组进行字典排序
  let arr = [timestamp,nonce,'atguigu']
  let arr2 = arr.sort()
  //2.将上述字典排序过的数组，每一个项取出，拼成一个字符串
  let str = arr2.join('')
  //3.将第二步的字符串进行sha1加密
  let sha1Str = sha1(str)
  console.log(sha1Str)
  console.log(signature)
  if(sha1Str === signature){
    response.send(echostr)
  }else{
    response.send('禁止非法请求本服务器')
  }

})

/*app.get('/',(request,response)=>{
  response.send('ok')
})*/

app.listen(3000,(err)=>{
  if(!err){
    console.log('服务器启动成功了')
  }else{
    console.log(err)
  }
})
let express = require('express')
//引入所有请求的“第一首”处理者
let requestHandler = require('./wechat/requestHandler')

let app = express()
//用于解析post请求的urlencoded编码形式的参数
app.use(express.urlencoded({extended:true}))
//引入自定义中间件，用于处理“第一手”的请求。
app.use(requestHandler)

app.listen(3000,(err)=>{
  if(!err){
    console.log('服务器启动成功了')
  }else{
    console.log(err)
  }
})
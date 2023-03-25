// 导入express模块
const express = require('express')
    // 创建服务器实例
const app = express()
    // 导入定义验证规则的包
const joi = require('joi')

// 配置允许跨域的中间件
const cors = require('cors')
app.use(cors())


// body-parser，用于处理application/x-www-form-urlencoded和application/json两种格式
// connect-multiparty，用于处理multipart/form-data格式
// 配置解析表单数据的中间件，注意：这个中间件，只能解析application/x-www-form-urlencoded格式的表单
// app.use(express.urlencoded({extended:false}))//（有兼容性，仅在4.16.0+版本中可用
// 导入解析表单的数据的中间件 body-parser
const parser = require('body-parser')
const multiparty = require('connect-multiparty')
    // 使用app.use()注册中间件
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
app.use(multiparty())


// 放在路由之前 封装res.cc 函数 优化 res.send() 代码
app.use((req, res, next) => {
    res.cc = function(err, status = 1) {
        res.send({ status, message: err instanceof Error ? err.message : err })
    }
    next()
})

// 一定要在路由之前配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(
    expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] })
)

// 导入并使用用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
    // 导入并使用用户信息的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)
    // 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

// 导入并使用文章路由模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)


// 定义全局错误级别的中间件
app.use((err, req, res, next) => {
    console.log('req.body===',req.body);
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
        // 判断身份认证失败后的错误信息
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
        // 未知错误
    res.cc(err)
})

// 启动服务器
app.listen(3007, function() {
    console.log('app server running at http://127.0.0.1:3007')
})
// 导入express模块
const express = require('express')
const router = express.Router()
const userinfoHandler = require('../router_handler/userinfo')
    // 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
    // 导入需要的验证规则对象 ,实现验证规则
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')
    // 挂在路由
    // 获取用户基本信息的路由
router.get('/userinfo', userinfoHandler.getUserInfo)
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfoHandler.updateUserInfo)
router.post('/updatePwd', expressJoi(update_password_schema), userinfoHandler.updatePwd)
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfoHandler.updateAvatar)



module.exports = router
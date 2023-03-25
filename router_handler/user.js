// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs包 进行密码加密
const bcrypt = require('bcryptjs')
// 导入生成token的包
const jwt = require('jsonwebtoken')
// 导入全局配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
	// 获取客户端提交到服务器的用户信息
	const userinfo = req.body
	// 对表单中的数据，进行合法性的校验
	// if (!userinfo.username || !userinfo.password) {
	// 	// return res.send({ status: 1, message: '用户名或密码不合法！' })
	// 	return res.cc('用户名或密码不合法！')
	// }
	const sqlStr = 'select * from ev_users where username=?' //查询语句得到的results是数组对象
	db.query(sqlStr, userinfo.username, (err, results) => {
		// if (err) return res.send({ status: 1, message: err.message })
		if (err) return res.cc(err)
		if (results.length > 0) {
			return res.cc('用户名被占用，请更换其他用户名！')
		}
	})
	// console.log('userinfo===', userinfo)

	// 调用bcrypt.hashSync()对应密码进行加密
	userinfo.password = bcrypt.hashSync(userinfo.password, 10)
	// console.log('userinfo===111111', userinfo)
	// 定义插入新用户的sql语句
	const sql = 'insert into ev_users set ?'
	// 调用db.query()执行sql语句
	db.query(
		sql,
		{ username: userinfo.username, password: userinfo.password },
		(err, results) => {
			// if (err) return res.send({ status: 1, message: err.message })
			if (err) return res.cc(err)
			if (results.affectedRows !== 1)
				return res.cc('注册用户失败，请稍后再试！')
			// return res.send({
			// 	status: 1,
			// 	message: '注册用户失败，请稍后再试！',
			// })

			// 注册用户成功
			// res.send({ status: 0, message: '注册成功' })
			res.cc('注册成功', 0)
		}
	)
}

exports.login = (req, res) => {
	// console.log(1324325435,req.body);
	// 接受表单的数据
	const userinfo = req.body
	const sql = 'select * from ev_users where username=?'
	db.query(sql, userinfo.username, (err, results) => {
		// console.log(results)
		if (err) return res.cc(err)
		if (results.length !== 1) return res.cc('登录失败！')
		const compareResult = bcrypt.compareSync(
			userinfo.password,
			results[0].password
		)
		if (!compareResult) return res.cc('登陆失败！')
		// 在服务器端生成token的字符串
		const user = { ...results, password: '', user_pic: '' }
		// 对用户的信息进行加密，生成token字符串
		const tokenStr = jwt.sign(user, config.jwtSecretKey, {
			expiresIn: config.expiresIn,
		})
		// console.log(tokenStr)
		res.send({
			status: 0,
			message: '登录成功！',
			token: 'Bearer ' + tokenStr,
		})
	})
}

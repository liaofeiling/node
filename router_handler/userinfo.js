// 导入数据库操作模块
const db = require("../db/index");
// 导入bcryptjs包 进行密码加密
const bcrypt = require("bcryptjs");
exports.getUserInfo = (req, res) => {
    console.log("req==", req.user[0].id);
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`;
    // 调用db.query()执行sql语句
    db.query(sql, req.user[0].id, (err, results) => {
        // console.log(results)
        // 执行sql语句失败
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc("获取用户信息失败！");
        res.send({
            status: 0,
            message: "获取用户信息成功！",
            data: results[0],
        });
    });
};
exports.updateUserInfo = (req, res) => {
    const sql = "update ev_users set ? where id=?";
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc("修改用户基本信息失败！");
        return res.cc("修改用户信息成功", 0);
    });
};
// 更新用户密码的处理函数
exports.updatePwd = (req, res) => {
    console.log('updatePwd',req.body);
    const sql = "select * from ev_users where id=?";
    db.query(sql, req.user[0].id, (err, results) => {
        if (err) return res.cc(err);
        // 判断结果是否存在
        if (results.length !== 1) return res.cc("用户不存在！");
        // 判断密码是否正确
        const compareResult = bcrypt.compareSync(
            req.body.oldPwd,
            results[0].password
        );
        if (!compareResult) return res.cc("就密码错误！");
        // 定义更新密码sql语句
        const sqlStr = "update ev_users set password=? where id=?";
        // 对密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        // 调用db.query()执行sql语句
        db.query(sqlStr, [newPwd, req.user[0].id], (err, results) => {
            // 执行语句sql失败
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) res.cc("更新密码失败！");
            // 成功
            res.cc("更新密码成功！", 0);
        });
    });
};

// 新增用户头像
exports.updateAvatar = (req, res) => {
    const sql = "update ev_users set user_pic=? where id=?";
    console.log("req.user[0].id", req.user);
    console.log("req.user[0].id", req.user[0].id);
    db.query(sql, [req.body.avatar, req.user[0].id], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err);
        // 影响的行数是否等于1
        if (results.affectedRows !== 1) return res.cc("更换头像失败！");
        res.cc("更换头像成功！", 0);
    });
};
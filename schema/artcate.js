// 导入定义验证规则
const joi = require("joi");
// alphanum既可以是字母也可以是数字
const uname = joi.string().required();
const alias = joi.string().alphanum().required();
const id = joi.number().integer().min(1).required();

exports.add_cate_schema = {
    body: {
        name: uname,
        alias,
    },
};
// 验证规则对象-删除对象
exports.delete_cate_schema = {
    params: {
        id,
    },
};
// 验证规则对象-根据id获取文章分类
exports.getArt_cate_schema = {
    params: {
        id,
    },
};
// 验证规则对象-更新分类信息
exports.update_cate_schema = {
    body: {
        id,
        name: uname,
        alias,
    },
};
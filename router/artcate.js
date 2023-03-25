// 这个是文章分类的路由模块
const express = require("express");
const router = express.Router();
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
const { add_cate_schema, delete_cate_schema, getArt_cate_schema, update_cate_schema } = require("../schema/artcate");
const getArtCatesHandler = require("../router_handler/articate");

// 获取文章分类列表数据的路由
router.get("/cates", getArtCatesHandler.getArtCates);
router.post(
    "/addCates",
    expressJoi(add_cate_schema),
    getArtCatesHandler.addArticleCates
);
router.get('/deletecate/:id', expressJoi(delete_cate_schema), getArtCatesHandler.deleteCateById)
router.get('/cates/:id', expressJoi(getArt_cate_schema), getArtCatesHandler.getArtCateById)
router.post('/updateCate', expressJoi(update_cate_schema), getArtCatesHandler.updateCateById)
module.exports = router;
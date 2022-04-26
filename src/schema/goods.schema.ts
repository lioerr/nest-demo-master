import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const d = new Date();
export const GoodsSchema = new Schema({
  title: { type: String },
  sub_title: { type: String },                      // 二级标题
  goods_sn: { type: String },                       // 货号 编码
  cate_id: { type: Schema.Types.ObjectId },         // 商品分类
  click_count: { type: Number, default: 100 },      // 点击数量
  goods_number: { type: Number, default: 1000 },    // 商品库存
  shop_price: { type: Number },                     // 商铺价格 优惠价
  market_price: { type: Number },                   // 市场价格  原价
  relation_goods: { type: String },                 // 关联商品
  goods_attr: { type: String },                     // 商品属性
  goods_version: { type: String },                  // 版本 6G+128G  8G+128G  8G+265G   
  goods_img: { type: String },                      // 
  goods_gift: { type: String },                     // 赠品
  goods_fitting: { type: String },                  // 配件
  goods_color: { type: String },                    //
  goods_keywords: { type: String },                 //
  goods_desc: { type: String },                     //
  goods_content: { type: String },                  //
  sort: { type: Number, default: 100 },             //
  is_delete: { type: Number },                      // 是否软删除
  is_hot: { type: Number },                         // 热销
  is_best: { type: Number },                        // 精选
  is_new: { type: Number },                         // 最新
  goods_type_id: { type: Schema.Types.Mixed, default: 100 },
  status: { type: Number, default: 1 },             //
  add_time: { type: Number, default: d.getTime() }
});
